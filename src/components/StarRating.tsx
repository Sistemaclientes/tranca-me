import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

const StarRating = ({ rating, totalReviews, size = "sm", showNumber = true }: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className={`${textSizes[size]} text-muted-foreground font-medium`}>
          {rating.toFixed(1)}
          {totalReviews !== undefined && ` (${totalReviews})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
