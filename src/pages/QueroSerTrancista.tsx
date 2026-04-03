import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Users, Smartphone, Star, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroCover from "@/assets/hero-cover.png";

const QueroSerTrancista = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroCover} 
            alt="Trancista trabalhando" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background"></div>
        </div>
        
        <div className="container mx-auto relative z-10 text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1 mb-4 animate-fade-in">
            Vagas limitadas por região
          </Badge>
          <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto animate-slide-up">
            Consiga <span className="text-primary">clientes todos os dias</span> na sua região
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up delay-100">
            Cadastre seu perfil gratuitamente e apareça para centenas de clientes que buscam trancistas em São José, Florianópolis e região.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-200">
            <Link to="/auth?role=braider">
              <Button size="hero" className="text-lg px-8 py-6">
                Criar meu perfil grátis
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground animate-fade-in delay-300">
            Mais de <span className="font-bold text-foreground">500+ clientes</span> buscando trancistas todos os meses.
          </p>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 border-y border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">200+</p>
              <p className="text-sm text-muted-foreground">Trancistas Parceiras</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">5k+</p>
              <p className="text-sm text-muted-foreground">Acessos Mensais</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">1.2k+</p>
              <p className="text-sm text-muted-foreground">Leads Gerados</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">4.9/5</p>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <h2 className="font-display text-4xl font-bold leading-tight">Por que fazer parte da Trancei?</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Nossa plataforma foi desenhada para valorizar seu trabalho e facilitar o contato direto com clientes de forma visualmente atraente.
                </p>
              </div>
              
              <div className="grid gap-8">
                <div className="flex gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold">Mais Clientes</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Apareça para pessoas que já estão procurando por trancistas na sua cidade.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <ShieldCheck className="h-7 w-7 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold">Autoridade</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Tenha um perfil profissional com avaliações reais e portfólio visual impactante.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Smartphone className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold">WhatsApp Direto</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Receba contatos diretamente no seu WhatsApp sem intermediários ou taxas por serviço.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-soft transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=600&auto=format&fit=crop" alt="Trança sendo feita" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden shadow-soft">
                  <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop" alt="Cliente feliz" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-soft">
                  <img src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=600&auto=format&fit=crop" alt="Detalhe de penteado" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-soft transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=600&auto=format&fit=crop" alt="Trancista trabalhando" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation / Dashboard Preview */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-4xl font-bold leading-tight">
                Seu Dashboard de Crescimento
              </h2>
              <p className="text-lg text-muted-foreground">
                Acompanhe quantos clientes viram seu perfil e quantos clicaram no seu WhatsApp em tempo real.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Controle total do seu perfil e fotos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Ranking por visibilidade regional</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Histórico de clientes interessados</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/auth?role=braider">
                  <Button size="lg" className="px-8">
                    Começar agora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
              <Card className="relative bg-white border-none shadow-2xl overflow-hidden">
                <div className="bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs font-medium text-primary">Painel da Trancista</span>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-sm text-muted-foreground">Visualizações</p>
                      <p className="text-2xl font-bold">1.248</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <p className="text-sm text-primary font-medium">WhatsApp</p>
                      <p className="text-2xl font-bold text-primary">84</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Últimos contatos:</p>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Cliente interessada em Tranças</span>
                        </div>
                        <span className="text-xs text-muted-foreground">há 2h</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <h2 className="font-display text-4xl font-bold text-center mb-16">O que dizem nossas parceiras</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Camila Silva"
              city="Palhoça"
              text="Depois que entrei na Trancei, minha agenda nunca mais ficou vazia. Recebo contatos todos os dias!"
              rating={5}
            />
            <TestimonialCard 
              name="Beatriz Santos"
              city="Florianópolis"
              text="A plataforma é super fácil de usar. Os clientes já chegam decididos porque viram meu portfólio."
              rating={5}
            />
            <TestimonialCard 
              name="Juliana Oliveira"
              city="São José"
              text="O melhor é que o contato é direto no meu WhatsApp. Sem burocracia nenhuma."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 bg-gradient-hero text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="container mx-auto text-center space-y-8 relative z-10">
          <h2 className="font-display text-4xl lg:text-6xl font-bold">
            Pronta para escalar seu negócio?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Não perca mais tempo buscando clientes. Deixe que eles encontrem você na maior plataforma especializada em beleza afro da região.
          </p>
          <div className="pt-4">
            <Link to="/auth?role=braider">
              <Button variant="outline" size="hero" className="bg-white text-primary hover:bg-white/90 border-white text-lg px-12">
                Começar hoje - É Grátis
              </Button>
            </Link>
          </div>
          <p className="text-white/70">Comece a receber seus primeiros contatos em até 24h.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center space-y-4">
          <p className="font-display text-xl font-bold">Trancei</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Valorizando a beleza afro e impulsionando o empreendedorismo feminino na Grande Florianópolis.
          </p>
          <div className="flex justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <Link to="/trancistas-sao-jose-sc" className="hover:text-primary">São José</Link>
            <Link to="/trancistas-florianopolis" className="hover:text-primary">Florianópolis</Link>
            <Link to="/trancistas-palhoca" className="hover:text-primary">Palhoça</Link>
            <Link to="/trancistas-biguacu" className="hover:text-primary">Biguaçu</Link>
          </div>
          <p className="text-xs text-muted-foreground pt-8">© 2025 Trancei. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="bg-white border-none shadow-soft hover:shadow-glow transition-all duration-300">
    <CardContent className="p-8 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ name, city, text, rating }: { name: string, city: string, text: string, rating: number }) => (
  <Card className="bg-white/50 backdrop-blur-sm border-none shadow-soft">
    <CardContent className="p-8 space-y-4">
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
        ))}
      </div>
      <p className="italic text-muted-foreground">"{text}"</p>
      <div className="pt-4">
        <p className="font-bold">{name}</p>
        <p className="text-sm text-muted-foreground">{city}, SC</p>
      </div>
    </CardContent>
  </Card>
);

import { Badge } from "@/components/ui/badge";

export default QueroSerTrancista;
