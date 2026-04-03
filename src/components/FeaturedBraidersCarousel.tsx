import { useEffect, useState, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import StarRating from "@/components/StarRating";
import { useReviews } from "@/hooks/useReviews";
import AutoScroll from "embla-carousel-auto-scroll";

const BraiderCard = memo(({ braider }: { braider: any }) => {
  const navigate = useNavigate();
  const { averageRating, totalReviews } = useReviews(braider.id);

  return (
    <Card
      className="bg-gradient-card border-none shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer h-full"
      onClick={() => navigate(`/trancista/${braider.id}`)}
    >
      <CardContent className="p-4 space-y-3">
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
            <Badge className="absolute top-2 right-2 bg-gradient-hero border-none text-white">
              Premium
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold line-clamp-1">
            {braider.professional_name || braider.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">
              {braider.neighborhood}, {braider.city}
            </span>
          </div>
          {totalReviews > 0 && (
            <StarRating rating={averageRating} totalReviews={totalReviews} size="sm" />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

BraiderCard.displayName = "BraiderCard";

const FeaturedBraidersCarousel = () => {
  const navigate = useNavigate();
  const [braiders, setBraiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBraiders();
  }, []);

  const loadBraiders = async () => {
    const { data } = await supabase
      .from("active_braiders")
      .select("*")
      .order("is_premium", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(8);
    
    setBraiders(data || []);
    setLoading(false);
  };

  if (loading || braiders.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        AutoScroll({
          speed: 1.5,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {braiders.map((braider) => (
          <CarouselItem key={braider.id} className="md:basis-1/2 lg:basis-1/4">
            <BraiderCard braider={braider} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default FeaturedBraidersCarousel;
