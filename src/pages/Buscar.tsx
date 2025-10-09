import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Star } from "lucide-react";

const Buscar = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-8">
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

            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Digite sua cidade ou bairro..."
                  className="h-12 text-base"
                />
              </div>
              <Button variant="hero" size="lg">
                <Search className="h-5 w-5" />
                Buscar
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="aspect-square bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-semibold">
                        Nome da Trancista
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Cidade, Bairro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-semibold">4.9</span>
                        <span className="text-sm text-muted-foreground">(127 avaliações)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Buscar;
