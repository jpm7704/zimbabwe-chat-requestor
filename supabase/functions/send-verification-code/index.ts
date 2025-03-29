
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if email is a business email
const isBusinessEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) return false;
  
  // Get the domain part of the email
  const domain = email.split('@')[1].toLowerCase();
  
  // Check for common free email providers that shouldn't be allowed
  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
    'zoho.com', 'yandex.com', 'gmx.com'
  ];
  
  // If it's in the free email list, it's not a business email
  return !freeEmailProviders.includes(domain);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if this is a business email
    if (!isBusinessEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Staff verification requires a business email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get user by email
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();
      
    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Code expires in 1 hour
    
    // Store verification code in the database
    const { error: insertError } = await supabase
      .from('staff_verification_codes')
      .insert({
        user_id: userData.id,
        code: code,
        expires_at: expiresAt.toISOString(),
      });
      
    if (insertError) {
      throw insertError;
    }
    
    // Send email with verification code
    const { error: emailError } = await supabase
      .auth.admin.sendRawMagicLink({
        email: email,
        redirectTo: "http://localhost:3000/staff-verification",
        withLink: true,
        additionalData: {
          verification_code: code,
          is_staff_verification: true
        }
      });
      
    if (emailError) {
      throw emailError;
    }

    return new Response(
      JSON.stringify({ message: "Verification code sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-verification-code function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while sending the verification code" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
