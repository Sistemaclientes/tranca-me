import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  braider_id: string;
  client_name: string;
  rating: number;
  comment: string | null;
  service_date: string | null;
  created_at: string;
  is_verified: boolean;
}

export const useReviews = (braiderId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (braiderId) {
      loadReviews();
    }
  }, [braiderId]);

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("braider_id", braiderId)
      .eq("is_verified", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
      setTotalReviews(data.length);
      
      if (data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    }
    
    setLoading(false);
  };

  return { reviews, averageRating, totalReviews, loading };
};
