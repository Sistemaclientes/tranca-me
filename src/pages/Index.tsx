import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import FeaturedBraidersCarousel from "@/components/FeaturedBraidersCarousel";
import CoverageAreas from "@/components/home/CoverageAreas";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Inspiration from "@/components/home/Inspiration";
import ForBraiders from "@/components/home/ForBraiders";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-warm selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Featured Braiders Section */}
        <section id="destaques" className="py-24 px-4 bg-muted/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>
          
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Seleção Premium
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">
                  Trancistas em Destaque
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Conheça as profissionais mais recomendadas e bem avaliadas da nossa plataforma.
                </p>
              </div>
              <Link to="/buscar">
                <Button variant="outline" size="lg" className="group border-2 font-bold px-8 shadow-sm hover:shadow-md transition-all">
                  Ver Todas
                  <Search className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <FeaturedBraidersCarousel />
          </div>
        </section>

        {/* Map Section */}
        <CoverageAreas />

        {/* How it works Section */}
        <Features />

        {/* Visual Inspiration Section */}
        <Inspiration />

        {/* Section for Professionals */}
        <ForBraiders />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;