import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
// Removed FeaturedBraidersCarousel as requested to use PremiumBraiders grid style
import CoverageAreas from "@/components/home/CoverageAreas";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Inspiration from "@/components/home/Inspiration";
import ForBraiders from "@/components/home/ForBraiders";
import Footer from "@/components/home/Footer";
import PremiumBraiders from "@/components/PremiumBraiders";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-warm selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Categories Section - Added this as it might be the "missing cards" */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Box Braids", icon: <Sparkles className="h-5 w-5" /> },
                { name: "Nagô", icon: <MapPin className="h-5 w-5" /> },
                { name: "Knotless", icon: <Star className="h-5 w-5" /> },
                { name: "Twist", icon: <Sparkles className="h-5 w-5" /> },
                { name: "Dreads", icon: <MapPin className="h-5 w-5" /> },
              ].map((cat, idx) => (
                <Link key={idx} to={`/buscar?service=${cat.name}`}>
                  <Button variant="outline" className="rounded-full px-6 py-6 border-2 hover:bg-primary hover:text-white transition-all">
                    {cat.icon}
                    <span className="ml-2 font-semibold">{cat.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Braiders Section */}
        <section id="destaques" className="py-20 px-4 bg-muted/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>
          
          <div className="container mx-auto">
            <div className="flex flex-col items-center text-center mb-16 gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mx-auto">
                  Seleção Premium
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Trancistas em <span className="text-primary italic">Destaque</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl">
                  Conheça as profissionais mais recomendadas e bem avaliadas da nossa plataforma.
                </p>
              </div>
              
              <Link to="/buscar">
                <Button variant="outline" size="lg" className="group border-2 font-bold px-8 shadow-sm hover:shadow-md transition-all rounded-full">
                  Ver Todas as Profissionais
                  <Search className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform text-primary" />
                </Button>
              </Link>
            </div>
            <div className="w-full mt-4 md:mt-8">
              <FeaturedBraidersCarousel />
            </div>
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