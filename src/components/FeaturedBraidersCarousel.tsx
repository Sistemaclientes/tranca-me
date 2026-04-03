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
import BraiderCard from "@/components/BraiderCard";
import AutoScroll from "embla-carousel-auto-scroll";


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
          speed: 1,
          stopOnInteraction: false,
          stopOnMouseEnter: false,
        }),
      ]}
      className="w-full max-w-7xl mx-auto"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {braiders.map((braider) => (
          <CarouselItem 
            key={braider.id} 
            className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pb-8"
          >
            <div className="h-full px-1">
              <BraiderCard braider={braider} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeaturedBraidersCarousel;
