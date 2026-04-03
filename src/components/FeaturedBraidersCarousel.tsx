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
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full max-w-7xl mx-auto"
    >
      <CarouselContent className="-ml-4">
        {braiders.map((braider) => (
          <CarouselItem key={braider.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pb-4">
            <BraiderCard braider={braider} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-4 mt-12">
        <CarouselPrevious className="relative inset-0 h-12 w-12 border-2 text-primary hover:bg-primary hover:text-white transition-all shadow-sm" />
        <CarouselNext className="relative inset-0 h-12 w-12 border-2 text-primary hover:bg-primary hover:text-white transition-all shadow-sm" />
      </div>
    </Carousel>
  );
};

export default FeaturedBraidersCarousel;
