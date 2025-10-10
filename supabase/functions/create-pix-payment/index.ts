import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userName, email, amount, planType } = await req.json()

    console.log('Creating PIX payment:', { userName, email, amount, planType })

    // Create payment in Mercado Pago
    const mercadoPagoResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: `Assinatura ${planType} - Trança Brasil`,
        payment_method_id: 'pix',
        payer: {
          email: email || 'cliente@trancabrasil.com',
          first_name: userName,
        },
        notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
      }),
    })

    const paymentData = await mercadoPagoResponse.json()
    console.log('Mercado Pago response:', paymentData)

    if (!mercadoPagoResponse.ok) {
      throw new Error(`Mercado Pago error: ${JSON.stringify(paymentData)}`)
    }

    // Save to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: paymentAttempt, error: dbError } = await supabase
      .from('payment_attempts')
      .insert({
        user_name: userName,
        email: email,
        amount: amount,
        plan_type: planType,
        status: paymentData.status,
        payment_id: paymentData.id.toString(),
        qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    console.log('Payment attempt saved:', paymentAttempt)

    return new Response(
      JSON.stringify({
        success: true,
        paymentId: paymentData.id,
        qrCode: paymentData.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
        status: paymentData.status,
        attemptId: paymentAttempt.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})