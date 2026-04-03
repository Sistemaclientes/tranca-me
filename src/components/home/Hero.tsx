import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import heroCover from "@/assets/hero-cover.png";

const Hero = () => {
  return (
    <section className="relative pt-20 pb-12 px-4 min-h-[500px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 scale-105 animate-subtle-zoom">
        <img 
          src={heroCover} 
          alt="Capa Trancei" 
          className="w-full h-full object-cover" 
          fetchPriority="high" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            A maior rede de trancistas de SC
          </div>
          
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
            Conectando <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Trancistas e Clientes
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Encontre profissionais especializadas em tranças na sua região ou divulgue seus serviços para milhares de clientes em toda a grande Florianópolis.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/buscar">
              <Button variant="hero" size="lg" className="shadow-glow hover:scale-105 transition-all px-8">
                <Search className="h-4 w-4 mr-2" />
                Buscar Trancistas
              </Button>
            </Link>
            <Link to="/quero-ser-trancista">
              <Button variant="outline" size="lg" className="bg-background/50 backdrop-blur-sm border-2 hover:bg-background/80 transition-all px-8">
                Sou Trancista
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;