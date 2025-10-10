-- Fix security definer view by recreating approved_payments view with security_invoker
DROP VIEW IF EXISTS public.approved_payments;

CREATE VIEW public.approved_payments
WITH (security_invoker=on)
AS
SELECT 
  id,
  user_name,
  email,
  amount,
  plan_type,
  payment_id,
  approved_at,
  created_at
FROM public.payment_attempts
WHERE status = 'approved';