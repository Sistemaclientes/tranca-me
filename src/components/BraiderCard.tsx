import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import StarRating from "@/components/StarRating";
import FavoriteButton from "@/components/FavoriteButton";
import { useReviews } from "@/hooks/useReviews";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface BraiderCardProps {
  braider: any;
  showFavorite?: boolean;
}

const BraiderCard = memo(({ braider, showFavorite = false }: BraiderCardProps) => {
  const navigate = useNavigate();
  // Use the pre-calculated ratings from the braider object
  const averageRating = braider.average_rating || 0;
  const totalReviews = braider.total_reviews || 0;

  const maskPhone = (phone: string) => {
    if (!phone) return "";
    const clean = phone.replace(/\D/g, "");
    if (clean.length === 11) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    } else if (clean.length === 10) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    }
    return phone;
  };

  return (
    <Card 
      className="bg-card border border-border/50 shadow-sm hover:shadow-glow hover:scale-[1.02] transition-all duration-500 cursor-pointer relative group overflow-hidden rounded-[24px]"
      onClick={() => navigate(`/trancista/${braider.id}`)}
    >
      {showFavorite && (
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton braiderId={braider.id} variant="icon" />
        </div>
      )}
      
      <div className="aspect-[4/5] overflow-hidden relative">
        <img 
          src={getOptimizedImageUrl(braider.image_url || `https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=600&auto=format&fit=crop`, 400)} 
          alt={braider.professional_name || braider.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
        
        {braider.is_premium && (
          <Badge className="absolute top-4 left-4 bg-gradient-hero border-none text-white shadow-glow px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
            Premium
          </Badge>
        )}

        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
          <h3 className="font-display text-xl font-bold leading-tight">
            {braider.professional_name || braider.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-white/90">
            <MapPin className="h-3 w-3 text-primary" />
            <span>{braider.neighborhood}, {braider.city}</span>
          </div>
          {braider.whatsapp && (
            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-2 transition-all duration-300 overflow-hidden transform group-hover:scale-105 origin-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Informações de Contato</p>
              <p className="text-sm font-semibold">{maskPhone(braider.whatsapp)}</p>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-5 space-y-4 bg-background">
        <div className="flex items-center justify-between">
          {totalReviews > 0 ? (
            <StarRating rating={averageRating} totalReviews={totalReviews} size="sm" />
          ) : (
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Nova Profissional</div>
          )}
        </div>

        {(() => {
          const allServices = [...(braider.braid_types || []), ...(braider.services || [])];
          if (allServices.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1.5">
              {allServices.slice(0, 2).map((service: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-[10px] bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 px-2 py-0">
                  {service}
                </Badge>
              ))}
              {allServices.length > 2 && (
                <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground border-none px-2 py-0">
                  +{allServices.length - 2}
                </Badge>
              )}
            </div>
          );
        })()}
      </CardContent>
    </Card>
    );
});

BraiderCard.displayName = "BraiderCard";

export default BraiderCard;
