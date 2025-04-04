
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Utility function to clear all data from the application tables
 * This preserves table structure but removes all rows
 */
export const clearAllData = async () => {
  const { toast } = useToast();
  
  try {
    // Clear attachments table
    await supabase.from('attachments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear field_visits table
    await supabase.from('field_visits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear messages table
    await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear notifications table
    await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear reports table
    await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear requests table
    await supabase.from('requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear status_updates table
    await supabase.from('status_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear staff_roles table
    await supabase.from('staff_roles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear staff_verification_codes table
    await supabase.from('staff_verification_codes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Clear user_profiles table
    await supabase.from('user_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log("All data has been successfully cleared");
    return { success: true, message: "All application data has been cleared successfully" };
    
  } catch (error) {
    console.error("Error clearing data:", error);
    return { 
      success: false, 
      message: "Failed to clear application data",
      error
    };
  }
};
