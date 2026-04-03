import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLeads } from "@/hooks/useLeads";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Edit, 
  Star,
  Crown,
  Calendar,
  Heart,
  MessageSquare,
  TrendingUp,
  Share2,
  Sparkles,
  Zap,
  Users
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import StarRating from "@/components/StarRating";
import { toast as sonnerToast } from "sonner";

interface BraiderProfile {
  id: string;
  name: string;
  professional_name: string | null;
  email: string;
  whatsapp: string;
  city: string;
  neighborhood: string;
  instagram: string | null;
  facebook: string | null;
  description: string | null;
  services: string[] | null;
  pricing: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  is_premium: boolean;
  plan_tier: 'free' | 'pro' | 'premium';
  status: 'trial' | 'active' | 'expired' | 'blocked' | 'pending_payment';
  view_count: number;
  whatsapp_click_count: number;
  premium_since: string | null;
  created_at: string;
}

interface Lead {
  id: string;
  braider_id: string;
  client_id: string | null;
  created_at: string;
}

const MeuPerfil = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getBraiderLeads } = useLeads();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [profile, setProfile] = useState<BraiderProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserEmail(session.user.email || "");

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (roleData) {
        setUserRole(roleData.role);
      }

      const { data: profileData } = await supabase
        .from("braider_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as BraiderProfile);

        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("*")
          .eq("braider_id", profileData.id)
          .order("created_at", { ascending: false })
          .limit(5);

        setReviews(reviewsData || []);

        // Load leads
        const braiderLeads = await getBraiderLeads(profileData.id);
        setLeads(braiderLeads || []);
      }

      const { data: favoritesData } = await supabase
        .from("favorites")
        .select(`
          id,
          braider_id,
          braider_profiles (
            id,
            name,
            professional_name,
            image_url,
            city,
            neighborhood
          )
        `)
        .eq("user_id", session.user.id);

      setFavorites(favoritesData as any || []);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const shareProfile = () => {
    if (!profile) return;
    const url = `${window.location.origin}/trancista/${profile.id}`;
    if (navigator.share) {
      navigator.share({
        title: profile.professional_name || profile.name,
        text: 'Confira meu perfil na Trancei!',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      sonnerToast.success("Link do perfil copiado!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                Painel da Trancista
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus resultados e atraia mais clientes
              </p>
            </div>
            {profile && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={shareProfile}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar Perfil
                </Button>
                {profile.plan_tier !== 'premium' && (
                  <Link to="/assinatura">
                    <Button variant="hero">
                      <Zap className="h-4 w-4 mr-2" />
                      Quero Mais Clientes
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="relative inline-block">
                    {profile?.image_url ? (
                      <img 
                        src={profile.image_url} 
                        alt={profile.name}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {profile?.plan_tier === 'premium' && (
                      <div className="absolute -bottom-1 -right-1 bg-gradient-hero text-white p-1.5 rounded-full shadow-lg">
                        <Crown className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-display text-xl font-bold">
                      {profile?.professional_name || profile?.name}
                    </h2>
                    <Badge variant="secondary" className="mt-1">
                      Plano {profile?.plan_tier || 'Grátis'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-3 bg-white/50 rounded-xl">
                      <p className="text-sm text-muted-foreground">Vistas</p>
                      <p className="text-xl font-bold">{profile?.view_count || 0}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <p className="text-sm text-primary font-medium">Cliques</p>
                      <p className="text-xl font-bold text-primary">{profile?.whatsapp_click_count || 0}</p>
                    </div>
                  </div>

                  <Link to="/perfil" className="block w-full">
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Tips for Instagram */}
              <Card className="bg-gradient-hero text-white border-none shadow-soft overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Instagram className="h-5 w-5" />
                    Bora Postar?
                  </CardTitle>
                  <CardDescription className="text-white/80">Ideias para seu Instagram hoje</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/10 p-3 rounded-lg text-sm border border-white/10">
                    <p className="font-bold">✨ Transformação</p>
                    <p className="text-white/80">Poste um Reel do "Antes e Depois" com uma música viral.</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-sm border border-white/10">
                    <p className="font-bold">📸 Close nos Detalhes</p>
                    <p className="text-white/80">Mostre o acabamento impecável das suas tranças nagô.</p>
                  </div>
                  <Button variant="outline" className="w-full bg-white text-primary hover:bg-white/90" onClick={shareProfile}>
                    Postar link do meu perfil
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Section - Leads and Reviews */}
            <div className="lg:col-span-2 space-y-6">
              {/* Leads Received */}
              <Card className="bg-white border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-display text-2xl text-primary flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Leads Recebidos
                      </CardTitle>
                      <CardDescription>Pessoas que demonstraram interesse no seu trabalho</CardDescription>
                    </div>
                    <Badge variant="hero" className="text-xs">
                      {leads.length} Contatos
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {leads.length > 0 ? (
                    <div className="divide-y divide-border">
                      {leads.map((lead) => (
                        <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold">Cliente interessada em Tranças</p>
                              <p className="text-sm text-muted-foreground">
                                Clicou no seu WhatsApp em {new Date(lead.created_at).toLocaleDateString('pt-BR')} às {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          {profile?.plan_tier === 'free' ? (
                            <div className="text-right">
                              <Badge variant="secondary" className="mb-2">Oculto</Badge>
                              <p className="text-xs text-muted-foreground max-w-[150px]">Faça upgrade para ver mais detalhes do cliente.</p>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Contato Ativo</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center space-y-4">
                      <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground">Você ainda não recebeu contatos. Complete seu perfil para atrair clientes!</p>
                      <Link to="/perfil">
                        <Button variant="outline">Adicionar mais fotos</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reviews Received */}
              <Card className="bg-white border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-secondary/5 border-b border-secondary/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-display text-2xl text-secondary flex items-center gap-2">
                        <Star className="h-6 w-6 text-amber-500" />
                        Avaliações Recebidas
                      </CardTitle>
                      <CardDescription>O que suas clientes estão dizendo sobre seu trabalho</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reviews.length} Avaliações
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {reviews.length > 0 ? (
                    <div className="divide-y divide-border">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-6 space-y-2 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold">{review.client_name}</p>
                              <StarRating rating={review.rating} showNumber={false} size="sm" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-foreground italic">"{review.comment}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center space-y-4">
                      <Star className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                      <p className="text-muted-foreground">Você ainda não recebeu avaliações.</p>
                      <p className="text-sm text-muted-foreground">As avaliações aparecerão aqui assim que as clientes começarem a comentar.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Conversion Trigger for Leads */}
              {leads.length > 0 && profile?.plan_tier === 'free' && (
                <div className="bg-gradient-hero p-6 rounded-2xl text-white shadow-lg animate-bounce-subtle">
                  <div className="flex items-start gap-4">
                    <Sparkles className="h-8 w-8 shrink-0" />
                    <div className="space-y-2">
                      <p className="font-bold text-lg">Você recebeu {leads.length} potenciais clientes!</p>
                      <p className="text-white/80 text-sm">Trancistas Pro recebem até 5x mais contatos. Faça o upgrade agora para desbloquear seu potencial máximo.</p>
                      <Link to="/assinatura">
                        <Button className="bg-white text-primary hover:bg-white/90 border-none mt-2">
                          Fazer Upgrade e Ver Leads
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Favorites & Account Info Section (Simplified) */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white border-none shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Suas Favoritas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {favorites.length > 0 ? (
                      favorites.slice(0, 3).map((fav: any) => (
                        <Link key={fav.id} to={`/trancista/${fav.braider_profiles.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                          <img src={fav.braider_profiles.image_url || "/placeholder.svg"} className="h-10 w-10 rounded-full object-cover" alt="" />
                          <div className="text-sm">
                            <p className="font-bold truncate max-w-[150px]">{fav.braider_profiles.professional_name || fav.braider_profiles.name}</p>
                            <p className="text-xs text-muted-foreground">{fav.braider_profiles.city}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma favorita ainda.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Sua Conta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium truncate max-w-[150px]">{userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="outline" className="capitalize">{userRole || 'Usuário'}</Badge>
                    </div>
                    <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto text-sm justify-start" onClick={() => supabase.auth.signOut().then(() => navigate('/auth'))}>
                      Sair da conta
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeuPerfil;
