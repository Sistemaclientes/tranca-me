import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = (braiderId?: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (braiderId) {
      checkFavorite();
    }
  }, [braiderId]);

  const checkFavorite = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !braiderId) return;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("braider_id", braiderId)
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar favoritos",
        variant: "destructive",
      });
      return;
    }

    if (!braiderId) return;

    setLoading(true);

    if (isFavorite) {
      // Remove favorite
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("braider_id", braiderId);

      if (error) {
        toast({
          title: "Erro ao remover favorito",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
        });
      }
    } else {
      // Add favorite
      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: session.user.id,
          braider_id: braiderId,
        });

      if (error) {
        toast({
          title: "Erro ao adicionar favorito",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
        });
      }
    }

    setLoading(false);
  };

  return { isFavorite, loading, toggleFavorite };
};
