-- Add city and neighborhood columns to braider_profiles table
ALTER TABLE public.braider_profiles 
ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS neighborhood TEXT NOT NULL DEFAULT '';