import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface PremiumBraider {
  id: string;
  professional_name: string;
  name: string;
  city: string;
  neighborhood: string;
  image_url: string;
  pricing: string;
}

const PremiumBraiders = () => {
  const [braiders, setBraiders] = useState<PremiumBraider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPremiumBraiders();
  }, []);

  const fetchPremiumBraiders = async () => {
    const { data, error } = await supabase
      .from("braider_profiles")
      .select("id, professional_name, name, city, neighborhood, image_url, pricing")
      .eq("is_premium", true)
      .order("premium_since", { ascending: false })
      .limit(6);

    if (!error && data) {
      setBraiders(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-muted">
            <CardContent className="p-6">
              <div className="h-48 bg-muted-foreground/20 rounded-lg mb-4"></div>
              <div className="h-6 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (braiders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma trancista premium cadastrada ainda.</p>
      </div>
    );
  }

  const getBasePrice = (pricing: string | null) => {
    if (!pricing) return "Consulte valores";
    const match = pricing.match(/R\$\s*(\d+)/);
    return match ? `A partir de R$ ${match[1]}` : "Consulte valores";
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {braiders.map((braider) => (
        <Link key={braider.id} to={`/trancista/${braider.id}`}>
          <Card className="overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer bg-gradient-card border-none group">
            <div className="relative h-64 overflow-hidden">
              {braider.image_url && (
                <img
                  src={braider.image_url}
                  alt={braider.professional_name || braider.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Premium
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-display text-xl font-semibold mb-2">
                {braider.professional_name || braider.name}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {braider.neighborhood}, {braider.city}
              </div>
              <p className="text-sm font-medium text-primary">
                {getBasePrice(braider.pricing)}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default PremiumBraiders;