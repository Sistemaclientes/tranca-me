import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { braiders } from "@/data/braiders";

const BraiderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const braider = braiders.find(b => b.id === id);

  if (!braider) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navbar />
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Trancista não encontrada</h1>
            <Button onClick={() => navigate("/buscar")} variant="hero">
              Voltar para busca
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá ${braider.name}! Encontrei seu perfil na plataforma de trancistas e gostaria de agendar um horário.`);
    window.open(`https://wa.me/${braider.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/buscar")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para busca
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gradient-card border-none shadow-soft overflow-hidden">
                <img 
                  src={braider.image} 
                  alt={braider.name}
                  className="w-full aspect-square object-cover"
                />
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold mb-2">{braider.name}</h1>
                    <div className="flex items-center gap-1 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{braider.neighborhood}, {braider.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold text-lg">{braider.rating}</span>
                      <span className="text-sm text-muted-foreground">({braider.reviewCount} avaliações)</span>
                    </div>
                  </div>

                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={handleWhatsApp}
                  >
                    <Phone className="h-4 w-4" />
                    Agendar via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Sobre</h2>
                  <p className="text-muted-foreground leading-relaxed">{braider.description}</p>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Serviços</h2>
                  <div className="flex flex-wrap gap-2">
                    {braider.services.map((service, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-4 py-2 text-sm"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Contato</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                        <a 
                          href={`https://wa.me/${braider.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {braider.whatsapp}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a 
                          href={`mailto:${braider.email}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {braider.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Instagram className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Instagram</p>
                        <a 
                          href={`https://instagram.com/${braider.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {braider.instagram}
                        </a>
                      </div>
                    </div>

                    {braider.facebook && (
                      <div className="flex items-center gap-3">
                        <Facebook className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Facebook</p>
                          <a 
                            href={`https://facebook.com/${braider.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {braider.facebook}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BraiderProfile;
