-- Add amount column to subscriptions
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0;

-- Update subscription-specific functions
ALTER FUNCTION public.handle_new_braider_subscription() SET search_path = public;
ALTER FUNCTION public.sync_subscription_to_profile() SET search_path = public;

-- Recreate active_braiders view (INVOKER)
DROP VIEW IF EXISTS public.active_braiders;
CREATE VIEW public.active_braiders AS
SELECT 
    bp.*,
    CASE 
        WHEN bp.status = 'active' THEN 1
        WHEN bp.status = 'trial' THEN 2
        ELSE 3
    END as display_priority
FROM public.braider_profiles bp
WHERE (bp.status = 'active') 
   OR (bp.status = 'trial' AND bp.trial_ends_at > now());
