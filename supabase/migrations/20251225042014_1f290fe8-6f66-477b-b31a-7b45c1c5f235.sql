-- Adicionar policy para UPDATE na tabela payment_attempts (para service role)
-- Note: service_role já bypassa RLS, mas vamos adicionar uma policy explícita para webhooks
CREATE POLICY "Service role can update payment_attempts"
ON public.payment_attempts
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Adicionar bairros que faltam em São José
INSERT INTO public.neighborhoods (city_id, name)
SELECT c.id, 'Sertão do Maruim'
FROM cities c WHERE c.name = 'São José'
ON CONFLICT (city_id, name) DO NOTHING;