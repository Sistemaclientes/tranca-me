import { MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CoverageAreas = () => {
  const cities = [
    { name: "Florianópolis", neighborhoods: "Centro, Trindade, Ingleses, Lagoa, Campeche..." },
    { name: "São José", neighborhoods: "Kobrasol, Campinas, Barreiros, Centro..." },
    { name: "Palhoça", neighborhoods: "Pedra Branca, Pagani, Centro, Aririu..." },
    { name: "Biguaçu", neighborhoods: "Centro, Vendaval, Bom Viver..." }
  ];

  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
              Presença Local
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
              Cobertura na <br />
              <span className="text-primary">Grande Florianópolis</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Estamos presentes nos principais pontos da região, facilitando o encontro entre você e a profissional ideal.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {cities.map((city, index) => (
                <div key={index} className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-lg">{city.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{city.neighborhoods}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">
                <span className="text-primary font-bold">+500</span> trancistas cadastradas na região
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 relative animate-fade-in">
            <div className="aspect-square bg-gradient-hero rounded-[60px] transform rotate-3 absolute inset-0 -z-10 opacity-10 blur-2xl"></div>
            <div className="bg-card border border-border rounded-[40px] p-8 shadow-glow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                 <CheckCircle2 className="h-12 w-12 text-primary/20" />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-none">Dica de Busca</Badge>
                  <h4 className="text-2xl font-bold">Como escolher a melhor região?</h4>
                  <p className="text-muted-foreground">Filtre por bairro para encontrar trancistas que atendem em domicílio ou que possuem estúdio próximo a você, economizando tempo e transporte.</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <p className="font-medium">Busca inteligente por CEP</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <p className="font-medium">Filtro de atendimento domiciliar</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <p className="font-medium">Calculadora de distância (em breve)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageAreas;