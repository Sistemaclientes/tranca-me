import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PremiumBraiders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [premiumBraiders, setPremiumBraiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremiumBraiders();
  }, []);

  const loadPremiumBraiders = async () => {
    const { data, error } = await supabase
      .from("braider_profiles")
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
    return null; // Don't show the section if it's empty to avoid confusion
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {premiumBraiders.map((braider) => (
        <Card
          key={braider.id}
          className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer"
          onClick={() => navigate(`/trancista/${braider.id}`)}
        >
          <CardContent className="p-6 space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              {braider.image_url ? (
                <img
                  src={braider.image_url}
                  alt={braider.professional_name || braider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-6xl font-display text-white">
                    {(braider.professional_name || braider.name).charAt(0)}
                  </span>
                </div>
              )}
              {braider.is_premium && (
                <Badge className="absolute top-2 right-2 bg-gradient-hero border-none">
                  Premium
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-xl font-semibold">
                {braider.professional_name || braider.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {braider.neighborhood}, {braider.city}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PremiumBraiders;
