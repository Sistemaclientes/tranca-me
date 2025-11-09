import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Favoritos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadFavorites();
  }, []);

  const checkAuthAndLoadFavorites = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Faça login para ver seus favoritos",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    loadFavorites(session.user.id);
  };

  const loadFavorites = async (userId: string) => {
    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        braider_id,
        braider_profiles (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar favoritos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setFavorites(data || []);
    }
    setLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId);

    if (error) {
      toast({
        title: "Erro ao remover favorito",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      toast({
        title: "Removido dos favoritos",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="font-display text-4xl lg:text-5xl font-bold">
                Meus{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Favoritos
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Suas trancistas favoritas em um só lugar
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Carregando...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-4">
                  Você ainda não tem favoritos
                </p>
                <Button 
                  variant="hero"
                  onClick={() => navigate("/buscar")}
                >
                  Buscar Trancistas
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => {
                  const braider = favorite.braider_profiles;
                  return (
                    <Card 
                      key={favorite.id} 
                      className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer group relative"
                      onClick={() => navigate(`/trancista/${braider.id}`)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(favorite.id);
                        }}
                      >
                        <Heart className="h-5 w-5 fill-primary text-primary" />
                      </Button>
                      
                      <CardContent className="p-6 space-y-4">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          {braider.image_url ? (
                            <img 
                              src={braider.image_url} 
                              alt={braider.professional_name || braider.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-4xl font-display text-muted-foreground">
                                {(braider.professional_name || braider.name).charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-display text-xl font-semibold">
                            {braider.professional_name || braider.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{braider.neighborhood}, {braider.city}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Favoritos;
