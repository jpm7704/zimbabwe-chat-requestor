
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, userId } = await req.json();
    
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!code || !userId) {
      return new Response(
        JSON.stringify({ error: "Verification code and user ID are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify the code
    const { data: codeData, error: codeError } = await supabase
      .from('staff_verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .limit(1)
      .single();
      
    if (codeError || !codeData) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update staff verification code to used
    await supabase
      .from('staff_verification_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', codeData.id);
      
    // Update user's verification status in auth metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { staff_verified: true }
    });
    
    // Return success response
    return new Response(
      JSON.stringify({
        message: "Staff verification successful",
        user: {
          id: userProfile.id,
          role: userProfile.role
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in verify-staff-code function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during verification" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
