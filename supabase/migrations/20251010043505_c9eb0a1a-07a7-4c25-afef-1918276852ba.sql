-- Create payment_attempts table
CREATE TABLE public.payment_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  email TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  qr_code TEXT,
  qr_code_base64 TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert payment attempts
CREATE POLICY "Anyone can create payment attempts"
ON public.payment_attempts
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view their own payment attempts
CREATE POLICY "Users can view payment attempts"
ON public.payment_attempts
FOR SELECT
USING (true);

-- Create approved_payments view
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

-- Create trigger for updated_at
CREATE TRIGGER update_payment_attempts_updated_at
BEFORE UPDATE ON public.payment_attempts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();