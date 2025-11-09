import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Buscar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [braiders, setBraiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCities();
    loadBraiders();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      loadNeighborhoods(selectedCity);
    }
  }, [selectedCity]);

  const loadCities = async () => {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .eq("is_active", true)
      .order("name");
    
    if (error) {
      toast({
        title: "Erro ao carregar cidades",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCities(data || []);
    }
  };

  const loadNeighborhoods = async (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (!city) return;

    const { data, error } = await supabase
      .from("neighborhoods")
      .select("*")
      .eq("city_id", city.id)
      .eq("is_active", true)
      .order("name");
    
    if (error) {
      toast({
        title: "Erro ao carregar bairros",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNeighborhoods(data || []);
    }
  };

  const loadBraiders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("braider_profiles")
      .select("*")
      .order("is_premium", { ascending: false })
      .order("professional_name");
    
    if (error) {
      toast({
        title: "Erro ao carregar trancistas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setBraiders(data || []);
    }
    setLoading(false);
  };

  const filteredBraiders = useMemo(() => {
    return braiders.filter((braider) => {
      const cityMatch = !selectedCity || selectedCity === "all" || braider.city === selectedCity;
      const neighborhoodMatch = !selectedNeighborhood || selectedNeighborhood === "all" || braider.neighborhood === selectedNeighborhood;
      return cityMatch && neighborhoodMatch;
    });
  }, [braiders, selectedCity, selectedNeighborhood]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedNeighborhood(""); // Reset neighborhood when city changes
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">
                Encontre sua{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Trancista
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Busque profissionais qualificadas na sua região
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger className="h-12 text-base md:w-1/2">
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedNeighborhood} 
                onValueChange={setSelectedNeighborhood}
                disabled={!selectedCity || selectedCity === "all"}
              >
                <SelectTrigger className="h-12 text-base md:w-1/2">
                  <SelectValue placeholder="Selecione o bairro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os bairros</SelectItem>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood.id} value={neighborhood.name}>
                      {neighborhood.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Carregando...</p>
              </div>
            ) : filteredBraiders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhuma trancista encontrada com os filtros selecionados.
                </p>
                <Button 
                  variant="hero" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCity("");
                    setSelectedNeighborhood("");
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBraiders.map((braider) => (
                  <Card 
                    key={braider.id} 
                    className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/trancista/${braider.id}`)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        {braider.image_url ? (
                          <img 
                            src={braider.image_url} 
                            alt={braider.professional_name || braider.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-4xl font-display text-muted-foreground">
                              {(braider.professional_name || braider.name).charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display text-xl font-semibold">
                          {braider.professional_name || braider.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{braider.neighborhood}, {braider.city}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Buscar;
