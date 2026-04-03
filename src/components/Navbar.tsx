import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Settings, Heart, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      
      setIsAuthenticated(!!session);
      if (session) {
        await checkAdminRole(session.user.id);
      }
      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      setIsAuthenticated(!!session);
      if (session) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);


  const checkAdminRole = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!roles);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Até logo!",
        description: "Você saiu da sua conta.",
      });
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
          <span className="font-display text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Trancei
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/buscar">
            <Button variant="ghost">Buscar Trancistas</Button>
          </Link>
          {!isLoading && (
            <>
              {isAuthenticated && (
                <>
                  <Link to="/meu-perfil">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </Button>
                  </Link>
                  <Link to="/favoritos">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Favoritos
                    </Button>
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin/sugestoes">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              {isAuthenticated ? (
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline">Entrar</Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="hero">Cadastrar-se</Button>
                  </Link>
                </>
              )}
            </>
          )}
          {isLoading && (
             <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
