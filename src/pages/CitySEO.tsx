import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import BraiderCard from "@/components/BraiderCard";
import { MapPin, Search, Star, MessageSquare, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const cityData: Record<string, { name: string, title: string, description: string, content: string }> = {
  "sao-jose-sc": {
    name: "São José",
    title: "Trancistas em São José SC | Encontre as Melhores Profissionais",
    description: "Encontre trancistas especializadas em São José, SC. Box braids, knotless, nagô e muito mais. Veja fotos, avaliações e agende seu horário direto pelo WhatsApp.",
    content: "Se você está procurando por trancistas em São José, Santa Catarina, você chegou ao lugar certo. Nossa plataforma conecta você com as profissionais mais qualificadas da região, cobrindo bairros como Kobrasol, Campinas, Barreiros e arredores. Valorizamos a estética afro e o trabalho artesanal de cada trancista cadastrada em nossa rede."
  },
  "florianopolis": {
    name: "Florianópolis",
    title: "Trancistas em Florianópolis | Encontre as Melhores da Ilha e Continente",
    description: "As melhores trancistas de Florianópolis estão aqui. Atendimento na Ilha e no Continente. Box braids, twist e penteados afro com as melhores avaliações.",
    content: "Florianópolis é um polo de cultura e beleza, e as trancistas da Ilha da Magia são reconhecidas pelo seu talento excepcional. Seja no Centro, na Trindade, no Norte ou no Sul da Ilha, temos profissionais prontas para transformar seu visual com técnicas modernas e cuidado com a saúde capilar."
  },
  "palhoca": {
    name: "Palhoça",
    title: "Trancistas em Palhoça SC | Profissionais de Confiança",
    description: "Busque trancistas em Palhoça, SC. Profissionais experientes em tranças nagô, boxeadora e muito mais. Agendamento rápido e fácil.",
    content: "Em Palhoça, a procura por tranças de qualidade cresce a cada dia. Nossa plataforma ajuda você a encontrar a profissional ideal no Pagani, Pedra Branca, Ponte do Imaruim e outras regiões. Encontre alguém perto de você e garanta um resultado impecável."
  },
  "biguacu": {
    name: "Biguaçu",
    title: "Trancistas em Biguaçu SC | Encontre sua Profissional",
    description: "Melhores trancistas em Biguaçu, SC. Veja portfólios, preços e contatos. Agende agora suas tranças com segurança.",
    content: "Biguaçu conta com talentos incríveis na arte das tranças. Se você mora na região e quer renovar seu estilo com Box Braids ou Dreads, confira nossa lista de profissionais verificadas que atendem em Biguaçu e proximidades."
  }
};

const SEOFeature = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
  <div className="flex gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="font-bold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  </div>
);

const CitySEO = () => {
  const { citySlug } = useParams();
  const [braiders, setBraiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentCity = citySlug ? cityData[citySlug.replace('trancistas-', '')] : null;

  useEffect(() => {
    if (currentCity) {
      loadBraiders(currentCity.name);
      document.title = currentCity.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", currentCity.description);
    }
  }, [currentCity]);

  const loadBraiders = async (cityName: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("braider_profiles")
      .select("*")
      .eq("city", cityName)
      .order("is_premium", { ascending: false });
    
    if (!error) {
      setBraiders(data || []);
    }
    setLoading(false);
  };

  if (!currentCity) {
    return <div className="min-h-screen flex items-center justify-center">Cidade não encontrada</div>;
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Trancistas em ${currentCity.name}`,
    "description": currentCity.description,
    "url": window.location.href,
    "areaServed": {
      "@type": "City",
      "name": currentCity.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": currentCity.name,
        "addressRegion": "SC",
        "addressCountry": "BR"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 bg-gradient-hero text-white">
        <div className="container mx-auto text-center space-y-6">
          <Badge variant="secondary" className="bg-white/20 border-white/20 text-white hover:bg-white/30">
            Profissionais em {currentCity.name}
          </Badge>
          <h1 className="font-display text-4xl lg:text-6xl font-bold">
            As Melhores Trancistas em <span className="text-secondary">{currentCity.name}</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {currentCity.description}
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/buscar">
              <Button size="lg" variant="outline" className="bg-white text-primary border-white hover:bg-white/90">
                Ver Todas as Cidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Profissionais Disponíveis
              </h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 w-full bg-muted animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : braiders.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {braiders.map((braider) => (
                    <BraiderCard key={braider.id} braider={braider} showFavorite />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl shadow-soft">
                  <p className="text-muted-foreground text-lg mb-6">Ainda não temos trancistas cadastradas nesta região.</p>
                  <Link to="/quero-ser-trancista">
                    <Button variant="hero">Seja a primeira trancista em {currentCity.name}</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-white border-none shadow-soft sticky top-24">
                <CardContent className="p-8 space-y-6">
                  <h3 className="font-display text-2xl font-bold">Por que contratar via Trancei?</h3>
                  <div className="space-y-4">
                    <SEOFeature 
                      icon={<ShieldCheck className="h-5 w-5 text-primary" />}
                      title="Segurança e Confiança"
                      text="Trancistas avaliadas por clientes reais da região."
                    />
                    <SEOFeature 
                      icon={<Star className="h-5 w-5 text-secondary" />}
                      title="Qualidade Garantida"
                      text="Veja fotos reais dos trabalhos antes de contratar."
                    />
                    <SEOFeature 
                      icon={<Sparkles className="h-5 w-5 text-primary" />}
                      title="Valorização Afro"
                      text="Plataforma que celebra e valoriza a estética negra."
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="prose prose-sm text-muted-foreground">
                    <p>{currentCity.content}</p>
                    <p>Ao escolher uma trancista em {currentCity.name} através da Trancei, você apoia o empreendedorismo feminino local e garante um serviço de excelência.</p>
                  </div>

                  <div className="pt-4">
                    <Link to="/quero-ser-trancista">
                      <Button variant="outline" className="w-full">
                        Sou trancista em {currentCity.name}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30 px-4">
        <div className="container mx-auto text-center">
          <h3 className="font-semibold mb-6">Buscar em outras regiões próximas:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(cityData).map(slug => (
              <Link key={slug} to={`/trancistas-${slug}`}>
                <Button variant="ghost" className={citySlug?.includes(slug) ? "text-primary font-bold" : ""}>
                  {cityData[slug].name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2025 Trancei - O melhor guia de trancistas de Santa Catarina.</p>
        </div>
      </footer>
    </div>
  );
};

export default CitySEO;
