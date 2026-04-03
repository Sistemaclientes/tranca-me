-- Create an enum for plan tiers
DO $$ BEGIN
    CREATE TYPE plan_tier AS ENUM ('free', 'pro', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update braider_profiles table
ALTER TABLE public.braider_profiles 
ADD COLUMN IF NOT EXISTS plan_tier plan_tier DEFAULT 'free',
ADD COLUMN IF NOT EXISTS whatsapp_click_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    braider_id UUID NOT NULL REFERENCES public.braider_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policies for leads
CREATE POLICY "Braiders can view their own leads"
ON public.leads
FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM public.braider_profiles WHERE id = leads.braider_id
    )
);

CREATE POLICY "Anyone can create a lead"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_whatsapp_click()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.braider_profiles
    SET whatsapp_click_count = whatsapp_click_count + 1
    WHERE id = NEW.braider_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment click count
DROP TRIGGER IF EXISTS tr_increment_whatsapp_click ON public.leads;
CREATE TRIGGER tr_increment_whatsapp_click
AFTER INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION increment_whatsapp_click();
