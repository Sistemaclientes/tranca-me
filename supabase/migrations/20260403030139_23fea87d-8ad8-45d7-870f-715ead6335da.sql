CREATE OR REPLACE FUNCTION public.increment_view_count(profile_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.braider_profiles
    SET view_count = view_count + 1
    WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
