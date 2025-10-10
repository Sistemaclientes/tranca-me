-- Drop the view and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.approved_payments;

-- Create approved_payments view without SECURITY DEFINER
CREATE VIEW public.approved_payments AS
SELECT 
  id,
  user_name,
  email,
  amount,
  plan_type,
  payment_id,
  created_at,
  approved_at
FROM public.payment_attempts
WHERE status = 'approved';