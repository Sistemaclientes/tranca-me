import { Sparkles, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ForBraiders = () => {
  return (
    <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden text-white">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-secondary blur-[120px] animate-pulse delay-700"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
          <div className="flex-1 text-center md:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold tracking-wide uppercase">
              <Sparkles className="h-4 w-4 text-secondary-foreground" />
              <span>Para Profissionais</span>
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight">Valorize seu Talento</h2>
            <p className="text-xl text-white/90 max-w-xl leading-relaxed">
              Divulgue seu trabalho, mostre seu portfólio e conquiste novos clientes todos os dias. Comece sua jornada conosco hoje!
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 pt-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Portfólio Visual</h4>
                  <p className="text-sm text-white/80">Mostre seus melhores trabalhos para o público certo</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Perfil Verificado</h4>
                  <p className="text-sm text-white/80">Ganhe credibilidade com selo de verificação</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link to="/quero-ser-trancista">
                <Button variant="outline" size="hero" className="bg-white text-primary hover:bg-white/90 border-white font-bold px-12 transition-all transform hover:scale-105 shadow-xl">
                  Criar meu perfil grátis
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block w-2/5 animate-fade-in">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden border-8 border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 relative group">
              <img 
                src="https://images.unsplash.com/photo-1596462502278-27bfad4575a6?q=80&w=600&auto=format&fit=crop" 
                alt="Trancista em ação" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForBraiders;