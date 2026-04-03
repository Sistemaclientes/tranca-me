import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Star, Phone, Mail, Instagram, Facebook, Edit, Heart } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import FavoriteButton from "@/components/FavoriteButton";
import ReviewsSection from "@/components/ReviewsSection";
import { useLeads } from "@/hooks/useLeads";
import { toast } from "sonner";

const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

const BraiderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [braider, setBraider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { registerLead } = useLeads();

  useEffect(() => {
    loadProfile();

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Loading profile timed out");
        setLoading(false);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timeout);
  }, [id]);

  const loadProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from("braider_profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (profile) {
        // Check if profile is active or user is owner/admin
        const { data: { session } } = await supabase.auth.getSession();
        const is_owner = session?.user?.id === profile.user_id;
        
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session?.user?.id)
          .eq("role", "admin")
          .maybeSingle();
        
        const is_admin = !!roleData;
        
        // Bloqueio deve ser validado no backend, mas no frontend tratamos a visibilidade
        const is_blocked = profile.status === 'blocked';
        const is_expired = profile.status === 'expired';

        if ((is_blocked || is_expired) && !is_owner && !is_admin) {
          navigate("/trancista-nao-encontrada");
          return;
        }

        setBraider(profile);
        setIsOwner(is_owner);
        
        // Increment view count
        await supabase.rpc('increment_view_count', { profile_id: id });
      } else {
        navigate("/trancista-nao-encontrada");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/trancista-nao-encontrada");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!braider) {
    return null; // Will redirect automatically
  }

  const handleWhatsApp = async () => {
    // Register lead
    const success = await registerLead(braider.id);
    if (success) {
      const message = encodeURIComponent(`Olá ${braider.name}! Encontrei seu perfil na plataforma de trancistas e gostaria de agendar um horário.`);
      window.open(`https://wa.me/${braider.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    } else {
      toast.error("Erro ao registrar interesse. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {braider.status !== 'active' && braider.status !== 'trial' && (
            <Card className="mb-8 border-none bg-destructive/10 text-destructive shadow-soft">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-destructive/20 rounded-full">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">
                      {braider.status === 'blocked' ? 'Perfil Bloqueado' : 'Plano Expirado'}
                    </p>
                    <p className="text-sm opacity-90">
                      {isOwner 
                        ? 'Seu perfil está oculto. Regularize seu pagamento para voltar a aparecer.' 
                        : 'Este perfil está temporariamente indisponível para novos agendamentos.'}
                    </p>
                  </div>
                </div>
                {isOwner && (
                  <Button variant="destructive" onClick={() => navigate("/assinatura")}>
                    Regularizar Agora
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

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
                {braider.image_url ? (
                  <img 
                    src={braider.image_url} 
                    alt={`Foto de ${braider.name}`}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Sem foto</p>
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold mb-2">
                      {braider.professional_name || braider.name}
                    </h1>
                    <div className="flex items-center gap-1 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{braider.neighborhood}, {braider.city}</span>
                    </div>
                  </div>

                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={handleWhatsApp}
                    disabled={braider.status === 'blocked' || braider.status === 'expired'}
                  >
                    <Phone className="h-4 w-4" />
                    {braider.status === 'blocked' || braider.status === 'expired' 
                      ? 'Contato Indisponível' 
                      : 'Agendar via WhatsApp'}
                  </Button>

                  <FavoriteButton braiderId={id!} />

                  {isOwner && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate("/perfil")}
                    >
                      <Edit className="h-4 w-4" />
                      Editar Perfil
                    </Button>
                  )}
                </CardContent>
              </Card>

              {braider.video_url && (
                <Card className="bg-gradient-card border-none shadow-soft overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <video 
                        controls 
                        className="w-full h-full"
                        src={braider.video_url}
                      >
                        Seu navegador não suporta vídeos.
                      </video>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Contato</h2>
                  <div className="space-y-3">
                    <a 
                      href={`https://wa.me/${braider.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      <span>{formatPhoneNumber(braider.whatsapp)}</span>
                    </a>

                    <a 
                      href={`mailto:${braider.email}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      <span>{braider.email}</span>
                    </a>

                    {braider.instagram && (
                      <a 
                        href={`https://instagram.com/${braider.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        <Instagram className="h-5 w-5 text-primary" />
                        <span>{braider.instagram}</span>
                      </a>
                    )}

                    {braider.facebook && (
                      <a 
                        href={`https://facebook.com/${braider.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        <Facebook className="h-5 w-5 text-primary" />
                        <span>{braider.facebook}</span>
                      </a>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <h2 className="font-display text-xl font-semibold mb-4">Sobre</h2>
                  <p className="leading-relaxed">{braider.description}</p>

                  <Separator className="my-6" />

                  <h2 className="font-display text-xl font-semibold mb-4">Serviços</h2>
                  <div className="flex flex-wrap gap-2">
                    {braider.services && braider.services.length > 0 ? (
                      braider.services.map((service: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {service}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                    )}
                  </div>

                  {braider.gallery_urls && braider.gallery_urls.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <h2 className="font-display text-xl font-semibold mb-4">Galeria de Trabalhos</h2>
                      <ImageGallery 
                        images={braider.gallery_urls} 
                        title={braider.professional_name || braider.name}
                        isPremium={braider.is_premium}
                      />
                    </>
                  )}

                  <Separator className="my-6" />

                  <h2 className="font-display text-xl font-semibold mb-4">Avaliações</h2>
                  <ReviewsSection braiderId={id!} />
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
