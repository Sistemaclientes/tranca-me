import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FavoriteButton from "@/components/FavoriteButton";
import BraiderCard from "@/components/BraiderCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Buscar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [braiders, setBraiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const allServices = [
    "Box Braids",
    "Knotless Braids",
    "Twist",
    "Nagô",
    "Tranças",
    "Dreads",
    "Crochet Braids",
  ];

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
      const serviceMatch = !selectedService || selectedService === "all" || braider.services?.includes(selectedService);
      const nameMatch = !searchName || braider.professional_name?.toLowerCase().includes(searchName.toLowerCase()) || braider.name?.toLowerCase().includes(searchName.toLowerCase());
      
      return cityMatch && neighborhoodMatch && serviceMatch && nameMatch;
    });
  }, [braiders, selectedCity, selectedNeighborhood, selectedService, searchName]);

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

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger className="h-12 text-base md:w-64">
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
                  <SelectTrigger className="h-12 text-base md:w-64">
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

              <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros Avançados
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 p-4 border rounded-lg bg-card">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Serviço</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os serviços" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os serviços</SelectItem>
                          {allServices.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Avaliação Mínima</Label>
                      <Select value={minRating} onValueChange={setMinRating}>
                        <SelectTrigger>
                          <SelectValue placeholder="Qualquer avaliação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Qualquer avaliação</SelectItem>
                          <SelectItem value="4">4+ estrelas</SelectItem>
                          <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
                  <BraiderCard key={braider.id} braider={braider} showFavorite />
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
