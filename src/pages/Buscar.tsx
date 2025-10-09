import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star } from "lucide-react";
import { braiders, cities, neighborhoodsByCity } from "@/data/braiders";
import braider1 from "@/assets/braider-1.jpg";
import braider2 from "@/assets/braider-2.jpg";
import braider3 from "@/assets/braider-3.jpg";
import braider4 from "@/assets/braider-4.jpg";
import braider5 from "@/assets/braider-5.jpg";
import braider6 from "@/assets/braider-6.jpg";

const braiderImages = [braider1, braider2, braider3, braider4, braider5, braider6];

const Buscar = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");

  const filteredBraiders = useMemo(() => {
    return braiders.filter((braider) => {
      const cityMatch = !selectedCity || braider.city === selectedCity;
      const neighborhoodMatch = !selectedNeighborhood || braider.neighborhood === selectedNeighborhood;
      return cityMatch && neighborhoodMatch;
    });
  }, [selectedCity, selectedNeighborhood]);

  const availableNeighborhoods = selectedCity ? neighborhoodsByCity[selectedCity] : [];

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
                    <SelectItem key={city} value={city}>
                      {city}
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
                  {availableNeighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredBraiders.length === 0 ? (
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
                {filteredBraiders.map((braider, index) => (
                  <Card 
                    key={braider.id} 
                    className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/trancista/${braider.id}`)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={braiderImages[index]} 
                          alt={braider.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display text-xl font-semibold">
                          {braider.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{braider.neighborhood}, {braider.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">{braider.rating}</span>
                          <span className="text-sm text-muted-foreground">({braider.reviewCount} avaliações)</span>
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
