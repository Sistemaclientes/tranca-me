-- Set search path for functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_braider_review_metrics() SET search_path = public;
ALTER FUNCTION public.increment_braider_leads() SET search_path = public;
ALTER FUNCTION public.increment_view_count(UUID) SET search_path = public;
ALTER FUNCTION public.has_role(UUID, public.app_role) SET search_path = public;
ALTER FUNCTION public.approve_city_suggestion(UUID, UUID) SET search_path = public;
ALTER FUNCTION public.approve_neighborhood_suggestion(UUID, UUID) SET search_path = public;
