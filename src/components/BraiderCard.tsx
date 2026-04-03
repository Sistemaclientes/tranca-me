import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface BraiderCardProps {
  braider: any;
  showFavorite?: boolean;
}

const BraiderCard = memo(({ braider, showFavorite = false }: BraiderCardProps) => {
  const navigate = useNavigate();
  const averageRating = braider.average_rating || 0;
  const totalReviews = braider.total_reviews || 0;
  const allServices = [...(braider.braid_types || []), ...(braider.services || [])];

  return (
    <div
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer max-w-[140px] sm:max-w-[180px] w-full mx-auto"
      onClick={() => navigate(`/trancista/${braider.id}`)}
    >
      {showFavorite && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <FavoriteButton braiderId={braider.id} variant="icon" />
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/4] overflow-hidden relative">
        <img
          src={getOptimizedImageUrl(braider.image_url || "https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=400&auto=format&fit=crop", 300)}
          alt={braider.professional_name || braider.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {braider.is_premium && (
          <Badge className="absolute top-2.5 left-2.5 bg-gradient-hero border-none text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 shadow-md">
            Premium
          </Badge>
        )}

        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2">
          <h3 className="font-display text-xs sm:text-sm font-bold text-white leading-tight truncate">
            {braider.professional_name || braider.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="h-2.5 w-2.5 text-primary shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-white/85 truncate">
              {braider.neighborhood}, {braider.city}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-1.5 sm:p-2 space-y-1">
        {/* Rating */}
        <div className="flex items-center justify-between">
          {totalReviews > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-primary text-primary" />
              <span className="text-[10px] font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-[8px] text-muted-foreground">({totalReviews})</span>
            </div>
          ) : (
            <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-wide">Nova</span>
          )}
        </div>

        {/* Services */}
        {allServices.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {allServices.slice(0, 2).map((service: string, idx: number) => (
              <span key={idx} className="text-[8px] bg-primary/8 text-primary rounded-full px-1.5 py-0.5 font-medium">
                {service}
              </span>
            ))}
            {allServices.length > 2 && (
              <span className="text-[8px] bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">
                +{allServices.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

BraiderCard.displayName = "BraiderCard";

export default BraiderCard;
