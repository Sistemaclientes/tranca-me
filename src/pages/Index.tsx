import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import FeaturedBraidersCarousel from "@/components/FeaturedBraidersCarousel";
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
        <section id="destaques" className="py-16 px-4 bg-muted/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>
          
          <div className="container mx-auto">
            <div className="flex flex-col items-center text-center mb-12 gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mx-auto">
                  Seleção Premium
                </div>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                  Trancistas em Destaque
                </h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                  Conheça as profissionais mais recomendadas e bem avaliadas da nossa plataforma.
                </p>
              </div>
            </div>
              <Link to="/buscar">
                <Button variant="outline" size="sm" className="group border-2 font-bold px-6 shadow-sm hover:shadow-md transition-all">
                  Ver Todas
                  <Search className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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