import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  braiderId: string;
  variant?: "default" | "icon";
  className?: string;
}

const FavoriteButton = ({ braiderId, variant = "default", className }: FavoriteButtonProps) => {
  const { isFavorite, loading, toggleFavorite } = useFavorites(braiderId);

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        disabled={loading}
        className={cn("h-10 w-10", className)}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
      disabled={loading}
      className={cn("w-full", className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          isFavorite && "fill-current"
        )}
      />
      {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
    </Button>
  );
};

export default FavoriteButton;
