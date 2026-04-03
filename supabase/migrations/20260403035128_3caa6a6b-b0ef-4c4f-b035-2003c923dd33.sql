-- Create the function to process statuses
CREATE OR REPLACE FUNCTION public.process_subscription_statuses()
RETURNS void AS $$
BEGIN
    -- 1. Trial to Expired
    UPDATE public.subscriptions
    SET status = 'expired', 
        updated_at = now()
    WHERE status = 'trial' 
      AND trial_ends_at < now();

    -- 2. Active to Expired (if next payment date passed)
    UPDATE public.subscriptions
    SET status = 'expired',
        updated_at = now()
    WHERE status = 'active'
      AND next_payment_date < now();

    -- 3. Expired to Blocked (after 3 days of grace period)
    UPDATE public.subscriptions
    SET status = 'blocked',
        updated_at = now()
    WHERE status = 'expired'
      AND updated_at < (now() - interval '3 days');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable pg_cron if not already enabled (it usually requires superuser or is already available in extensions)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the job (runs every day at midnight)
-- We use a unique name for the cron job to avoid duplicates
SELECT cron.schedule('subscription-daily-check', '0 0 * * *', 'SELECT public.process_subscription_statuses()');

-- Run it once manually to catch up
SELECT public.process_subscription_statuses();
