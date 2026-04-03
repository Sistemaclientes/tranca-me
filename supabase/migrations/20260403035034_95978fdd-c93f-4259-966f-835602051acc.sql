-- Drop existing subscriptions table if needed or just alter it
DROP TABLE IF EXISTS public.subscriptions CASCADE;

CREATE TABLE public.subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'expired', 'blocked', 'pending_payment')),
    plan_type TEXT NOT NULL DEFAULT 'standard',
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
    next_payment_date TIMESTAMP WITH TIME ZONE,
    last_payment_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT subscriptions_user_id_key UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Function to handle trial creation
CREATE OR REPLACE FUNCTION public.handle_new_braider_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.subscriptions (user_id, status, trial_ends_at)
    VALUES (NEW.user_id, 'trial', now() + interval '7 days')
    ON CONFLICT (user_id) DO UPDATE SET
        status = 'trial',
        trial_ends_at = now() + interval '7 days';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription on braider profile creation
DROP TRIGGER IF EXISTS on_braider_created_subscription ON public.braider_profiles;
CREATE TRIGGER on_braider_created_subscription
AFTER INSERT ON public.braider_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_braider_subscription();

-- Function to sync subscription status to braider_profiles
CREATE OR REPLACE FUNCTION public.sync_subscription_to_profile()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.braider_profiles
    SET 
        status = NEW.status,
        trial_ends_at = NEW.trial_ends_at
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync status
DROP TRIGGER IF EXISTS on_subscription_updated_sync ON public.subscriptions;
CREATE TRIGGER on_subscription_updated_sync
AFTER INSERT OR UPDATE OF status, trial_ends_at ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.sync_subscription_to_profile();

-- Recreate the active_braiders view
-- Prioritize 'active' (rank 1) then 'trial' (rank 2)
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
WHERE bp.status IN ('active', 'trial')
AND (bp.trial_ends_at > now() OR bp.status = 'active');

-- Initialize existing profiles with a subscription record
INSERT INTO public.subscriptions (user_id, status, trial_ends_at)
SELECT user_id, status, COALESCE(trial_ends_at, now() + interval '7 days')
FROM public.braider_profiles
ON CONFLICT (user_id) DO NOTHING;
