import { Link } from "react-router-dom";
import { Sparkles, Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-20 px-4 border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group justify-center md:justify-start">
              <Sparkles className="h-7 w-7 text-primary group-hover:text-secondary transition-colors" />
              <span className="font-display text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Trancei
              </span>
            </Link>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto md:mx-0 leading-relaxed">
              Valorizando a beleza afro-brasileira e conectando talentos em toda a Grande Florianópolis.
            </p>
            <div className="flex gap-4 pt-2 justify-center md:justify-start">
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Links Rápidos</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link to="/buscar" className="hover:text-primary transition-colors">Buscar Trancistas</Link></li>
              <li><Link to="/quero-ser-trancista" className="hover:text-primary transition-colors">Quero ser Trancista</Link></li>
              <li><Link to="/favoritos" className="hover:text-primary transition-colors">Meus Favoritos</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Institucional</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link to="/auth" className="hover:text-primary transition-colors">Entrar na Conta</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-border/50 text-center text-muted-foreground text-sm font-medium">
          <p>© 2025 Trancei. Todos os direitos reservados. Feito com amor por Lovable.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;