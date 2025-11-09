import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import notFoundImage from "@/assets/trancista-not-found.png";

const BraiderNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="mb-8 animate-fade-in">
            <img
              src={notFoundImage}
              alt="Trancista não encontrada"
              className="w-full max-w-md mx-auto rounded-3xl shadow-soft"
            />
          </div>
          
          <div className="space-y-6 animate-slide-up">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
              Trancista não encontrada
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Não encontramos uma trancista com esses dados. Tente novamente com palavras-chave 
              diferentes ou volte para a busca.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/buscar")}
                className="animate-scale-in"
              >
                Voltar para busca
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
                className="animate-scale-in"
              >
                Ir para início
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BraiderNotFound;