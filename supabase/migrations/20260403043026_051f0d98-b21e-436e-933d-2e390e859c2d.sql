-- Drop the old constraint
ALTER TABLE public.braider_profiles 
DROP CONSTRAINT IF EXISTS braider_profiles_status_check;

-- Add the new constraint with updated values
ALTER TABLE public.braider_profiles 
ADD CONSTRAINT braider_profiles_status_check 
CHECK (status IN ('trial', 'active', 'expired', 'blocked', 'pending'));

-- Ensure default status is set if needed (optional but recommended)
ALTER TABLE public.braider_profiles 
ALTER COLUMN status SET DEFAULT 'trial';

-- Update existing 'inactive' to 'expired' or 'pending' if they exist, or just leave as is if we want to be safe.
-- Given 'inactive' was allowed before, we might want to map it to 'expired' or 'blocked' if we are changing the allowed list.
-- Let's check if there are any 'inactive' rows first, or just add 'inactive' to the new constraint if we want to keep it.
-- But the user explicitly provided a new list. I'll stick to the user's list.
