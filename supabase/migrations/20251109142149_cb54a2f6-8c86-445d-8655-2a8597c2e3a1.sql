-- Create city suggestions table
CREATE TABLE IF NOT EXISTS public.city_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'SC',
  suggested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (name, state)
);

-- Create neighborhood suggestions table
CREATE TABLE IF NOT EXISTS public.neighborhood_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  name TEXT NOT NULL,
  suggested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.city_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhood_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for city_suggestions
-- Anyone authenticated can suggest cities
CREATE POLICY "Authenticated users can suggest cities"
  ON public.city_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = suggested_by);

-- Users can view their own suggestions
CREATE POLICY "Users can view their own city suggestions"
  ON public.city_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = suggested_by);

-- Admins can view all suggestions
CREATE POLICY "Admins can view all city suggestions"
  ON public.city_suggestions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update suggestions (approve/reject)
CREATE POLICY "Admins can update city suggestions"
  ON public.city_suggestions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for neighborhood_suggestions
-- Anyone authenticated can suggest neighborhoods
CREATE POLICY "Authenticated users can suggest neighborhoods"
  ON public.neighborhood_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = suggested_by);

-- Users can view their own suggestions
CREATE POLICY "Users can view their own neighborhood suggestions"
  ON public.neighborhood_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = suggested_by);

-- Admins can view all suggestions
CREATE POLICY "Admins can view all neighborhood suggestions"
  ON public.neighborhood_suggestions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update suggestions (approve/reject)
CREATE POLICY "Admins can update neighborhood suggestions"
  ON public.neighborhood_suggestions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_city_suggestions_updated_at
  BEFORE UPDATE ON public.city_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_neighborhood_suggestions_updated_at
  BEFORE UPDATE ON public.neighborhood_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to approve city suggestion and create the city
CREATE OR REPLACE FUNCTION public.approve_city_suggestion(suggestion_id UUID, reviewer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_city_name TEXT;
  v_city_state TEXT;
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(reviewer_id, 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve suggestions';
  END IF;

  -- Get suggestion details
  SELECT name, state INTO v_city_name, v_city_state
  FROM public.city_suggestions
  WHERE id = suggestion_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Suggestion not found or already processed';
  END IF;

  -- Insert city if it doesn't exist
  INSERT INTO public.cities (name, state)
  VALUES (v_city_name, v_city_state)
  ON CONFLICT (name) DO NOTHING;

  -- Update suggestion status
  UPDATE public.city_suggestions
  SET 
    status = 'approved',
    reviewed_by = reviewer_id,
    reviewed_at = now()
  WHERE id = suggestion_id;
END;
$$;

-- Function to approve neighborhood suggestion and create the neighborhood
CREATE OR REPLACE FUNCTION public.approve_neighborhood_suggestion(suggestion_id UUID, reviewer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_city_id UUID;
  v_neighborhood_name TEXT;
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(reviewer_id, 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve suggestions';
  END IF;

  -- Get suggestion details
  SELECT city_id, name INTO v_city_id, v_neighborhood_name
  FROM public.neighborhood_suggestions
  WHERE id = suggestion_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Suggestion not found or already processed';
  END IF;

  -- Insert neighborhood if it doesn't exist
  INSERT INTO public.neighborhoods (city_id, name)
  VALUES (v_city_id, v_neighborhood_name)
  ON CONFLICT (city_id, name) DO NOTHING;

  -- Update suggestion status
  UPDATE public.neighborhood_suggestions
  SET 
    status = 'approved',
    reviewed_by = reviewer_id,
    reviewed_at = now()
  WHERE id = suggestion_id;
END;
$$;