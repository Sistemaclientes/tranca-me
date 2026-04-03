import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="flex items-center justify-center pt-32 px-4 pb-16">
        <div className="text-center space-y-6 max-w-md animate-slide-up">
          <div className="space-y-2">
            <h1 className="text-8xl font-display font-bold text-primary opacity-20">404</h1>
            <h2 className="text-4xl font-display font-bold text-foreground">Página não encontrada</h2>
            <p className="text-lg text-muted-foreground">
              Desculpe, a página que você está procurando não existe ou foi movida.
            </p>
          </div>
          
          <div className="pt-4">
            <Link to="/">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Voltar para o Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
