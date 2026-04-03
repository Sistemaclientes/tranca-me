-- Add braid_types column to braider_profiles
ALTER TABLE public.braider_profiles 
ADD COLUMN IF NOT EXISTS braid_types TEXT[] DEFAULT '{}';

-- Add index for better performance on filtering by array
CREATE INDEX IF NOT EXISTS idx_braider_profiles_braid_types ON public.braider_profiles USING GIN(braid_types);
