import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Star, Heart, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroCover from "@/assets/hero-cover.png";
import PremiumBraiders from "@/components/PremiumBraiders";
import FeaturedBraidersCarousel from "@/components/FeaturedBraidersCarousel";

const Index = () => {
  return <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroCover} alt="Capa Trancei" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl space-y-6 animate-slide-up">
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight">
              Conectando{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Trancistas
              </span>{" "}
              e Clientes
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Encontre profissionais especializadas em tranças na sua região ou
              divulgue seus serviços para milhares de clientes em todo o Brasil.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/buscar">
                <Button variant="hero" size="lg" className="animate-scale-in">
                  <Search className="h-5 w-5" />
                  Buscar Trancistas
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="animate-scale-in">
                  Sou Trancista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Braiders Carousel */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold mb-2">Trancistas em Destaque</h2>
            <p className="text-muted-foreground">Conheça algumas profissionais cadastradas</p>
          </div>
          <FeaturedBraidersCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="font-display text-4xl font-bold">Como Funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma foi criada para facilitar a conexão entre
              profissionais e clientes de forma simples e segura
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold">Busque por Região</h3>
                <p className="text-muted-foreground">
                  Encontre trancistas qualificadas perto de você usando nosso
                  sistema de busca inteligente por cidade e bairro
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Star className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-display text-2xl font-semibold">Veja Avaliações</h3>
                <p className="text-muted-foreground">
                  Confira fotos de trabalhos anteriores e avaliações de outros
                  clientes para escolher a melhor profissional
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold">Conecte-se Fácil</h3>
                <p className="text-muted-foreground">
                  Entre em contato direto via WhatsApp ou Instagram e agende
                  seu horário com praticidade
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Braiders Section */}
      <section className="py-16 px-4 bg-gradient-hero">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center text-white space-y-6">
            <Sparkles className="h-12 w-12 mx-auto" />
            <h2 className="font-display text-4xl font-bold">Para Trancistas</h2>
            <p className="text-lg text-white/90">
              Divulgue seu trabalho, mostre seu portfólio e conquiste novos
              clientes todos os dias. Crie seu perfil gratuito e comece agora!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90 border-white">
                  Criar Perfil Grátis
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="flex items-start gap-3 text-left">
                <Heart className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Portfólio Visual</h4>
                  <p className="text-sm text-white/80">
                    Mostre seus melhores trabalhos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <Shield className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Perfil Verificado</h4>
                  <p className="text-sm text-white/80">
                    Ganhe credibilidade e confiança
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <MapPin className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Visibilidade Local</h4>
                  <p className="text-sm text-white/80">
                    Alcance clientes na sua região
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Braiders Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="font-display text-4xl font-bold">Trancistas em Destaques</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Profissionais em destaque. Reserve com facilidade.</p>
          </div>
          <PremiumBraiders />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Trancei. Valorizando a beleza afro-brasileira.</p>
        </div>
      </footer>
    </div>;
};
export default Index;