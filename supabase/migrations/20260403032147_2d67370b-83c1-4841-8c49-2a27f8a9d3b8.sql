-- Add review metrics to braider_profiles
ALTER TABLE public.braider_profiles 
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Function to update braider review metrics
CREATE OR REPLACE FUNCTION public.update_braider_review_metrics()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE public.braider_profiles
        SET 
            average_rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM public.reviews
                WHERE braider_id = NEW.braider_id AND is_verified = true
            ),
            total_reviews = (
                SELECT COUNT(*)
                FROM public.reviews
                WHERE braider_id = NEW.braider_id AND is_verified = true
            )
        WHERE id = NEW.braider_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.braider_profiles
        SET 
            average_rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM public.reviews
                WHERE braider_id = OLD.braider_id AND is_verified = true
            ),
            total_reviews = (
                SELECT COUNT(*)
                FROM public.reviews
                WHERE braider_id = OLD.braider_id AND is_verified = true
            )
        WHERE id = OLD.braider_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for reviews
DROP TRIGGER IF EXISTS trigger_update_braider_review_metrics ON public.reviews;
CREATE TRIGGER trigger_update_braider_review_metrics
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_braider_review_metrics();

-- Constraint to prevent duplicate reviews from same user
ALTER TABLE public.reviews 
ADD CONSTRAINT unique_user_braider_review UNIQUE (user_id, braider_id);

-- Initial update for all profiles
UPDATE public.braider_profiles bp
SET 
    average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews
        WHERE braider_id = bp.id AND is_verified = true
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE braider_id = bp.id AND is_verified = true
    );
