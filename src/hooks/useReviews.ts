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
    const { data: { session } } = await supabase.auth.getSession();
    
    // First get the braider profile to see if current user is owner
    const { data: profile } = await supabase
      .from("braider_profiles")
      .select("user_id")
      .eq("id", braiderId)
      .maybeSingle();

    const isOwner = session?.user?.id === profile?.user_id;

    let query = supabase
      .from("reviews")
      .select("*")
      .eq("braider_id", braiderId);

    // Only show unverified reviews to the owner
    if (!isOwner) {
      query = query.eq("is_verified", true);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

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

  const submitReview = async (reviewData: {
    rating: number;
    comment: string;
    client_name: string;
    service_date?: string;
  }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Você precisa estar logado para avaliar.");
    }

    const { error } = await supabase
      .from("reviews")
      .insert({
        braider_id: braiderId,
        user_id: session.user.id,
        client_name: reviewData.client_name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        service_date: reviewData.service_date,
        is_verified: true, // Auto-verify for now so it works immediately
      });

    if (error) {
      throw error;
    }

    await loadReviews();
  };

  return { reviews, averageRating, totalReviews, loading, submitReview, loadReviews };
};
