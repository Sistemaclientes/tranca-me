import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Star, Heart, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroCover from "@/assets/hero-cover.png";
import FeaturedBraidersCarousel from "@/components/FeaturedBraidersCarousel";
import FloripaMapsSection from "@/components/FloripaMapsSection";

const Index = () => {
  return <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroCover} alt="Capa Trancei" className="w-full h-full object-cover" fetchPriority="high" />
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
              Encontre profissionais especializadas em tranças na sua região ou divulgue seus serviços para milhares de clientes em toda a grande Florianópolis.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/buscar">
                <Button variant="hero" size="lg" className="animate-scale-in">
                  <Search className="h-5 w-5" />
                  Buscar Trancistas
                </Button>
              </Link>
              <Link to="/quero-ser-trancista">
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

      {/* Mapa da Grande Florianópolis */}
      <FloripaMapsSection />

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

      {/* Visual Inspiration Section */}
      <section className="py-16 px-4 bg-muted/20 overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-6">
              <h2 className="font-display text-4xl font-bold leading-tight">Inspire-se com os Melhores Estilos</h2>
              <p className="text-muted-foreground text-lg">
                As tranças são mais que um penteado, são uma expressão de arte e cultura. Nossa plataforma celebra essa beleza conectando você às melhores artistas da região.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-soft transform hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=600&auto=format&fit=crop" alt="Estilo de trança" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-soft transform translate-y-8 hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600&auto=format&fit=crop" alt="Detalhe de trança" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="aspect-square rounded-full bg-primary/5 absolute -top-10 -right-10 w-64 h-64 -z-10 blur-3xl"></div>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-glow max-w-sm mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600&auto=format&fit=crop" alt="Trancista profissional" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Braiders Section */}
      <section className="py-20 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-secondary blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-center md:text-left text-white space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-secondary-foreground" />
                <span>Para Profissionais</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">Valorize seu Talento</h2>
              <p className="text-lg text-white/90">
                Divulgue seu trabalho, mostre seu portfólio e conquiste novos
                clientes todos os dias. Crie seu perfil gratuito e comece agora!
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Portfólio Visual</h4>
                    <p className="text-sm text-white/80">Mostre seus melhores trabalhos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Perfil Verificado</h4>
                    <p className="text-sm text-white/80">Ganhe credibilidade</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/quero-ser-trancista">
                  <Button variant="outline" size="xl" className="bg-white text-primary hover:bg-white/90 border-white font-bold px-8">
                    Criar Perfil Grátis
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block w-1/3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfad4575a6?q=80&w=600&auto=format&fit=crop" alt="Trancista em ação" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">Trancei</h3>
              <p className="text-muted-foreground text-sm max-w-xs">Valorizando a beleza afro-brasileira e conectando talentos.</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/buscar" className="hover:text-primary transition-colors">Buscar</Link>
              <Link to="/quero-ser-trancista" className="hover:text-primary transition-colors">Cadastrar-se</Link>
              <Link to="/auth" className="hover:text-primary transition-colors">Entrar</Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-xs">
            <p>© 2025 Trancei. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
