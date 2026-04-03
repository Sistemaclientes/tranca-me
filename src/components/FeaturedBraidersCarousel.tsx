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
