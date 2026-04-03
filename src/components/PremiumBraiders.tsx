import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BraiderCard from "@/components/BraiderCard";

const PremiumBraiders = () => {
  const { toast } = useToast();
  const [premiumBraiders, setPremiumBraiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremiumBraiders();
  }, []);

  const loadPremiumBraiders = async () => {
    const { data, error } = await supabase
      .from("active_braiders")
      .select("*")
      .order("is_premium", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6);
    
    if (error) {
      toast({
        title: "Erro ao carregar trancistas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPremiumBraiders(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Carregando trancistas...</p>
      </div>
    );
  }

  if (premiumBraiders.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
      {premiumBraiders.map((braider) => (
        <BraiderCard key={braider.id} braider={braider} showFavorite />
      ))}
    </div>
  );
};

export default PremiumBraiders;