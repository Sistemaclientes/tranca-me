import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roles);
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
          {isAdmin && (
            <Link to="/admin/sugestoes">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
          <Link to="/auth">
            <Button variant="outline">Entrar</Button>
          </Link>
          <Link to="/auth">
            <Button variant="hero">Cadastrar-se</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
