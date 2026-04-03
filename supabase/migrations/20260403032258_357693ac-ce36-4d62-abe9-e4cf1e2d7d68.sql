-- View for active braiders only
CREATE OR REPLACE VIEW public.active_braiders AS
SELECT * FROM public.braider_profiles
WHERE status = 'active'
  AND (
      trial_ends_at > now() 
      OR is_premium = true 
      OR plan_tier != 'free'
  );

-- Update leads table to include trancista_id and client_id
-- (Already exists, but ensuring columns)

-- Function to handle lead registration (already implemented in leads table via insert)
-- We might want to add a trigger to notify the braider (Step 7)

-- Add columns for metrics to braider_profiles (if not exist)
ALTER TABLE public.braider_profiles
ADD COLUMN IF NOT EXISTS leads_count INTEGER DEFAULT 0;

-- Trigger to update leads_count when a lead is inserted
CREATE OR REPLACE FUNCTION public.increment_braider_leads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.braider_profiles
    SET leads_count = leads_count + 1
    WHERE id = NEW.braider_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_braider_leads ON public.leads;
CREATE TRIGGER trg_increment_braider_leads
AFTER INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.increment_braider_leads();
