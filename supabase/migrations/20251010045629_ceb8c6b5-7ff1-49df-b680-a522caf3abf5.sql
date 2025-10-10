-- Remove foreign key constraint to allow demo profiles
ALTER TABLE public.braider_profiles
DROP CONSTRAINT IF EXISTS braider_profiles_user_id_fkey;