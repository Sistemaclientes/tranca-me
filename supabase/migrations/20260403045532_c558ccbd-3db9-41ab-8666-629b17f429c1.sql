-- Create reports table for complaints/denuncias
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    braider_id UUID NOT NULL REFERENCES public.braider_profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for reports
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view all reports" ON public.reports FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
