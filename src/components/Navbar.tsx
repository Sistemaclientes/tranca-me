import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Settings, Heart, LogOut, User, Search } from "lucide-react";
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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        setIsAuthenticated(!!session);
        if (session) {
          await checkAdminRole(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300 group">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-soft">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Trancei
          </span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:flex items-center gap-2">
            <Link to="/#destaques">
              <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-primary transition-colors">Destaques</Button>
            </Link>
            <Link to="/buscar">
              <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-primary transition-colors">Buscar Trancistas</Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Link to="/buscar">
              <Button variant="ghost" size="icon" className="text-primary">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="h-6 w-px bg-border/50 hidden md:block"></div>

          {!isLoading && (
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <div className="flex items-center gap-2 mr-2">
                  <Link to="/favoritos">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/meu-perfil">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}
              
              {isAdmin && (
                <Link to="/admin" className="hidden lg:block">
                  <Button variant="ghost" size="sm" className="text-primary font-bold">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="font-bold hidden sm:inline-flex">Entrar</Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="hero" size="sm" className="font-bold shadow-soft">Cadastrar-se</Button>
                  </Link>
                </div>
              )}
            </div>
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
