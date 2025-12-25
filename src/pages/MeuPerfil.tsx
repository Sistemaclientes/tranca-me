import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  MessageSquare
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import StarRating from "@/components/StarRating";

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
  premium_since: string | null;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  client_name: string;
  created_at: string;
  is_verified: boolean;
}

interface Favorite {
  id: string;
  braider_id: string;
  braider_profiles: {
    id: string;
    name: string;
    professional_name: string | null;
    image_url: string | null;
    city: string;
    neighborhood: string;
  };
}

const MeuPerfil = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [profile, setProfile] = useState<BraiderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUserEmail(session.user.email || "");

    // Check user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (roleData) {
      setUserRole(roleData.role);
    }

    // Load braider profile if exists
    const { data: profileData } = await supabase
      .from("braider_profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);

      // Load reviews for this braider
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("braider_id", profileData.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setReviews(reviewsData || []);
    }

    // Load favorites
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

    setLoading(false);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas informações e acompanhe sua atividade
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - User Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Card */}
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardContent className="pt-6">
                  <div className="text-center">
                    {profile?.image_url ? (
                      <img 
                        src={profile.image_url} 
                        alt={profile.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    <h2 className="font-display text-xl font-bold">
                      {profile?.professional_name || profile?.name || userEmail.split("@")[0]}
                    </h2>
                    
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-2">
                      <Mail className="h-4 w-4" />
                      {userEmail}
                    </p>

                    {profile && (
                      <>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {profile.city}, {profile.neighborhood}
                        </p>

                        {profile.is_premium && (
                          <Badge className="mt-3 bg-gradient-hero text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    {profile ? (
                      <>
                        <Link to="/perfil">
                          <Button variant="outline" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Perfil
                          </Button>
                        </Link>
                        <Link to={`/trancista/${profile.id}`}>
                          <Button variant="ghost" className="w-full">
                            Ver Página Pública
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link to="/perfil">
                        <Button variant="hero" className="w-full">
                          Cadastrar como Trancista
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              {profile && (
                <Card className="bg-gradient-card border-none shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg font-display">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-lg">{calculateAverageRating()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Avaliação</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          <span className="font-bold text-lg">{reviews.length}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Avaliações</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Details */}
              {profile && (
                <>
                  {/* Contact Info */}
                  <Card className="bg-gradient-card border-none shadow-soft">
                    <CardHeader>
                      <CardTitle className="font-display text-primary">Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">WhatsApp</p>
                            <p className="font-medium">{profile.whatsapp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                        </div>
                        {profile.instagram && (
                          <div className="flex items-center gap-3">
                            <Instagram className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Instagram</p>
                              <p className="font-medium">{profile.instagram}</p>
                            </div>
                          </div>
                        )}
                        {profile.facebook && (
                          <div className="flex items-center gap-3">
                            <Facebook className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Facebook</p>
                              <p className="font-medium">{profile.facebook}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Services */}
                  <Card className="bg-gradient-card border-none shadow-soft">
                    <CardHeader>
                      <CardTitle className="font-display text-primary">Serviços Oferecidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profile.services && profile.services.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Gallery */}
                  {profile.gallery_urls && profile.gallery_urls.length > 0 && (
                    <Card className="bg-gradient-card border-none shadow-soft">
                      <CardHeader>
                        <CardTitle className="font-display text-primary">Galeria de Trabalhos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ImageGallery images={profile.gallery_urls} />
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Reviews */}
                  <Card className="bg-gradient-card border-none shadow-soft">
                    <CardHeader>
                      <CardTitle className="font-display text-primary">Avaliações Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{review.client_name}</span>
                                <StarRating rating={review.rating} size="sm" />
                              </div>
                              {review.comment && (
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(review.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Nenhuma avaliação ainda</p>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Favorites Section - for all users */}
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display text-primary flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Trancistas Favoritas
                  </CardTitle>
                  <CardDescription>Trancistas que você salvou</CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {favorites.map((fav) => (
                        <Link 
                          key={fav.id} 
                          to={`/trancista/${fav.braider_profiles.id}`}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          {fav.braider_profiles.image_url ? (
                            <img 
                              src={fav.braider_profiles.image_url} 
                              alt={fav.braider_profiles.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {fav.braider_profiles.professional_name || fav.braider_profiles.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {fav.braider_profiles.city}, {fav.braider_profiles.neighborhood}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">Você ainda não tem favoritos</p>
                      <Link to="/buscar">
                        <Button variant="link" className="mt-2">
                          Buscar trancistas
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display text-primary flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Informações da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{userEmail}</span>
                    </div>
                    {profile && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Membro desde</span>
                        <span className="font-medium">
                          {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    )}
                    {userRole && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tipo de conta</span>
                        <Badge variant="outline">{userRole}</Badge>
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

export default MeuPerfil;
