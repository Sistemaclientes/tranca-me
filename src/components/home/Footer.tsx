import { Link } from "react-router-dom";
import { Sparkles, Instagram, Facebook, Mail, Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group justify-center md:justify-start">
              <Sparkles className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
              <span className="font-display text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Trancei
              </span>
            </Link>
            <p className="text-muted-foreground text-base max-w-sm mx-auto md:mx-0 leading-relaxed">
              Valorizando a beleza afro-brasileira e conectando talentos em toda a Grande Florianópolis.
            </p>
            <div className="flex gap-4 pt-2 justify-center md:justify-start">
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-base">Links Rápidos</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><Link to="/buscar" className="hover:text-primary transition-colors">Buscar Trancistas</Link></li>
              <li><Link to="/quero-ser-trancista" className="hover:text-primary transition-colors">Quero ser Trancista</Link></li>
              <li><Link to="/favoritos" className="hover:text-primary transition-colors">Meus Favoritos</Link></li>
              <li><Link to="/cursos" className="hover:text-primary transition-colors">Cursos</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-base">Institucional</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><Link to="/auth" className="hover:text-primary transition-colors">Entrar na Conta</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5 justify-center md:justify-start">
                <Lock className="h-3 w-3" /> Painel Admin
              </Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-6 border-t border-border/50 text-center text-muted-foreground text-xs font-medium">
          <p>© 2025 Trancei. Todos os direitos reservados. Feito com amor por Lovable.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;