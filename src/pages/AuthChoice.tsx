import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search } from "lucide-react";

const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 space-y-4">
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Bem-vindo ao <span className="bg-gradient-hero bg-clip-text text-transparent">Trancei</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha como você deseja usar a plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 group cursor-pointer" onClick={() => navigate("/buscar")}>
              <CardHeader className="text-center pb-4">
                <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="font-display text-2xl">Sou Cliente</CardTitle>
                <CardDescription>
                  Quero encontrar uma trancista profissional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Buscar trancistas por região
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Ver portfólios e avaliações
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Contato direto via WhatsApp
                  </li>
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  Começar a buscar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 group cursor-pointer" onClick={() => navigate("/perfil")}>
              <CardHeader className="text-center pb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">Sou Trancista</CardTitle>
                <CardDescription>
                  Quero divulgar meu trabalho e conquistar clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Criar perfil profissional completo
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Exibir portfólio e serviços
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Receber contatos de clientes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Planos Basic e Premium disponíveis
                  </li>
                </ul>
                <Button variant="hero" className="w-full">
                  Cadastrar perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthChoice;