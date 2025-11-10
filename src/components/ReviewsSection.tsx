import { useReviews } from "@/hooks/useReviews";
import StarRating from "@/components/StarRating";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewsSectionProps {
  braiderId: string;
}

const ReviewsSection = ({ braiderId }: ReviewsSectionProps) => {
  const { reviews, averageRating, totalReviews, loading } = useReviews(braiderId);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando avaliações...</p>;
  }

  if (totalReviews === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma avaliação ainda.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Seja o primeiro a avaliar esta trancista!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</div>
          <StarRating rating={averageRating} showNumber={false} size="md" />
          <p className="text-xs text-muted-foreground mt-1">
            {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{review.client_name}</span>
                  {review.is_verified && (
                    <span className="text-xs text-primary font-medium">Verificado</span>
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
    </div>
  );
};

export default ReviewsSection;
