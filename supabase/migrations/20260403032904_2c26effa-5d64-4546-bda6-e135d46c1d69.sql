-- Create function to update braider review stats
CREATE OR REPLACE FUNCTION public.update_braider_review_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE public.braider_profiles
        SET 
            average_rating = (
                SELECT ROUND(AVG(rating)::numeric, 1)
                FROM public.reviews
                WHERE braider_id = NEW.braider_id AND is_verified = true
            ),
            total_reviews = (
                SELECT COUNT(*)
                FROM public.reviews
                WHERE braider_id = NEW.braider_id AND is_verified = true
            )
        WHERE id = NEW.braider_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.braider_profiles
        SET 
            average_rating = (
                SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
                FROM public.reviews
                WHERE braider_id = OLD.braider_id AND is_verified = true
            ),
            total_reviews = (
                SELECT COUNT(*)
                FROM public.reviews
                WHERE braider_id = OLD.braider_id AND is_verified = true
            )
        WHERE id = OLD.braider_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for the reviews table
DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_braider_review_stats();

-- Update RLS policies for reviews to be more permissive for owners
DROP POLICY IF EXISTS "Users can view own reviews" ON public.reviews;
CREATE POLICY "Users can view own reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Verified reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Verified reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (is_verified = true);

-- Add policy for braiders to see all reviews on their profile
DROP POLICY IF EXISTS "Braiders can view all reviews on their profile" ON public.reviews;
CREATE POLICY "Braiders can view all reviews on their profile" 
ON public.reviews 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.braider_profiles 
        WHERE id = reviews.braider_id AND user_id = auth.uid()
    )
);

-- Ensure is_verified defaults to true for now as requested in the code
ALTER TABLE public.reviews ALTER COLUMN is_verified SET DEFAULT true;
