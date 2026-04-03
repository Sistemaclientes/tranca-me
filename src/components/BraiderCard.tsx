import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import StarRating from "@/components/StarRating";
import FavoriteButton from "@/components/FavoriteButton";
import { useReviews } from "@/hooks/useReviews";

interface BraiderCardProps {
  braider: any;
  showFavorite?: boolean;
}

const BraiderCard = memo(({ braider, showFavorite = false }: BraiderCardProps) => {
  const navigate = useNavigate();
  const { averageRating, totalReviews } = useReviews(braider.id);

  return (
    <Card 
      className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer relative group"
      onClick={() => navigate(`/trancista/${braider.id}`)}
    >
      {showFavorite && (
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton braiderId={braider.id} variant="icon" />
        </div>
      )}
      
      <CardContent className="p-6 space-y-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
          {braider.image_url ? (
            <img 
              src={braider.image_url} 
              alt={braider.professional_name || braider.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
              <span className="text-5xl font-display text-white">
                {(braider.professional_name || braider.name).charAt(0)}
              </span>
            </div>
          )}
          {braider.is_premium && (
            <Badge className="absolute bottom-2 right-2 bg-gradient-hero border-none text-white">
              Premium
            </Badge>
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
          {totalReviews > 0 && (
            <StarRating rating={averageRating} totalReviews={totalReviews} size="sm" />
          )}
          {braider.services && braider.services.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {braider.services.slice(0, 3).map((service: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
              {braider.services.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{braider.services.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    );
});

BraiderCard.displayName = "BraiderCard";
export default BraiderCard;
