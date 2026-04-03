import { useReviews } from "@/hooks/useReviews";
import StarRating from "@/components/StarRating";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogged(!!session);
      if (session) {
        checkOwner(session.user.id);
      } else {
        setIsOwner(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [braiderId]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLogged(!!session);

      if (session) {
        await checkOwner(session.user.id);
        
        // Use user metadata to prefill name
        if (session.user.user_metadata?.full_name) {
          setClientName(session.user.user_metadata.full_name);
        } else if (session.user.user_metadata?.name) {
          setClientName(session.user.user_metadata.name);
        }
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const checkOwner = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("braider_profiles")
        .select("user_id")
        .eq("id", braiderId)
        .maybeSingle();

      if (profile) {
        setIsOwner(userId === profile.user_id);
      }
    } catch (error) {
      console.error("Error checking owner:", error);
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

        {!isOwner && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="hero" 
                className="shrink-0"
                onClick={(e) => {
                  if (!isLogged) {
                    e.preventDefault();
                    toast.info("Faça login para deixar sua avaliação!");
                    navigate("/auth");
                  }
                }}
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Avaliar Trancista
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md overflow-hidden border-none p-0 bg-background shadow-2xl">
              <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />
              <div className="p-6">
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MessageSquarePlus className="h-5 w-5 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">Avaliar Trancista</DialogTitle>
                  </div>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Compartilhe sua experiência e ajude outras pessoas a encontrarem as melhores profissionais.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                      <Label className="text-sm font-semibold block text-center">Sua nota para o serviço</Label>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 transition-all hover:scale-125 group"
                          >
                            <Star
                              className={`h-10 w-10 transition-colors ${
                                star <= rating
                                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                  : "text-muted-foreground/20 group-hover:text-amber-400/50"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                        {rating === 5 ? "Excelente!" : rating === 4 ? "Muito bom!" : rating === 3 ? "Bom" : rating === 2 ? "Poderia ser melhor" : "Ruim"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Seu nome <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Como você gostaria de aparecer na avaliação"
                        className="h-12 border-muted focus-visible:ring-primary/30 focus-visible:border-primary transition-all bg-muted/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comment" className="text-sm font-semibold">Comentário (opcional)</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Conte um pouco sobre o atendimento, as tranças, o ambiente..."
                        className="min-h-[120px] resize-none border-muted focus-visible:ring-primary/30 focus-visible:border-primary transition-all bg-muted/20"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 h-12 font-bold transition-all duration-300 active:scale-[0.98]" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Publicar Avaliação"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {totalReviews === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed border-muted-foreground/10">
          <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">Nenhuma avaliação ainda.</p>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Seja o primeiro a avaliar esta trancista!
          </p>
          {!isOwner && (
            <Button 
              variant="hero" 
              onClick={() => {
                if (!isLogged) {
                  toast.info("Faça login para deixar sua avaliação!");
                  navigate("/auth");
                } else {
                  setIsOpen(true);
                }
              }}
            >
              Avaliar Agora
            </Button>
          )}
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
