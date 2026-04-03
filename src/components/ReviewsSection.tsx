import { useReviews } from "@/hooks/useReviews";
import StarRating from "@/components/StarRating";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, MessageSquarePlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReviewsSectionProps {
  braiderId: string;
}

const ReviewsSection = ({ braiderId }: ReviewsSectionProps) => {
  const { reviews, averageRating, totalReviews, loading, submitReview } = useReviews(braiderId);
  const [isLogged, setIsLogged] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, [braiderId]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLogged(!!session);

      if (session) {
        // Use a simpler query or type assertion if needed, but maybeSingle should be fine
        const { data: profile } = await supabase
          .from("braider_profiles")
          .select("user_id")
          .eq("id", braiderId)
          .single();

        if (profile) {
          setIsOwner(session.user.id === profile.user_id);
        }
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Por favor, selecione uma avaliação.");
      return;
    }
    if (!clientName) {
      toast.error("Por favor, informe seu nome.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        rating,
        comment,
        client_name: clientName,
      });
      toast.success("Avaliação enviada com sucesso!");
      setIsOpen(false);
      setRating(5);
      setComment("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando avaliações...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg flex-1">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <StarRating rating={averageRating} showNumber={false} size="md" />
            <p className="text-xs text-muted-foreground mt-1">
              {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
            </p>
          </div>
        </div>

        {isLogged && !isOwner && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="shrink-0">
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Avaliar Trancista
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Avaliar Trancista</DialogTitle>
                <DialogDescription>
                  Compartilhe sua experiência com outros usuários.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Sua nota</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Seu nome</Label>
                  <Input
                    id="name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Como você gostaria de ser identificado"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comentário (opcional)</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="O que você achou do atendimento?"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting} variant="hero">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Avaliação"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {totalReviews === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma avaliação ainda.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Seja o primeiro a avaliar esta trancista!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.client_name}</span>
                    {review.is_verified ? (
                      <span className="text-xs text-primary font-medium">Verificado</span>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">Pendente de verificação</span>
                    )}
                  </div>
                  <StarRating rating={review.rating} showNumber={false} size="sm" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.created_at), "dd MMM yyyy", { locale: ptBR })}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-foreground mt-2">{review.comment}</p>
              )}
              {review.service_date && (
                <p className="text-xs text-muted-foreground mt-1">
                  Serviço realizado em {format(new Date(review.service_date), "dd/MM/yyyy")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
