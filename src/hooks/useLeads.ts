import { supabase } from "@/integrations/supabase/client";

export const useLeads = () => {
  const registerLead = async (braiderId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('leads')
        .insert([
          { 
            braider_id: braiderId,
            client_id: user?.id || null
          }
        ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error registering lead:", error);
      return false;
    }
  };

  const getBraiderLeads = async (braiderId: string) => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('braider_id', braiderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  return { registerLead, getBraiderLeads };
};
