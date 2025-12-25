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
    const { name, email, cpf, amount, planType } = await req.json()

    console.log('Creating PIX payment:', { name, email, cpf: cpf ? '***' : 'not provided', amount, planType })

    // Validate required fields
    if (!name || !email || !cpf || !amount) {
      throw new Error('Campos obrigatórios: name, email, cpf, amount')
    }

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured')
    }

    // Clean CPF - remove non-numeric characters
    const cleanCpf = cpf.replace(/\D/g, '')
    
    if (cleanCpf.length !== 11) {
      throw new Error('CPF inválido - deve conter 11 dígitos')
    }

    // Determine plan type based on amount
    const determinedPlanType = amount === 29.99 ? 'destaque' : amount === 9.99 ? 'busca' : planType || 'basic'

    console.log('Creating payment with Mercado Pago...')

    // Create payment in Mercado Pago - Checkout Transparente PIX
    const mercadoPagoResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: `Plano ${determinedPlanType.toUpperCase()} - Trancei`,
        payment_method_id: 'pix',
        payer: {
          email: email,
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ') || name,
          identification: {
            type: 'CPF',
            number: cleanCpf,
          },
        },
      }),
    })

    const paymentData = await mercadoPagoResponse.json()
    console.log('Mercado Pago status:', mercadoPagoResponse.status)
    console.log('Mercado Pago response:', JSON.stringify(paymentData, null, 2))

    if (!mercadoPagoResponse.ok) {
      const errorDetail = paymentData.message || paymentData.error || JSON.stringify(paymentData)
      throw new Error(`Erro Mercado Pago (${mercadoPagoResponse.status}): ${errorDetail}`)
    }

    // Save to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: paymentAttempt, error: dbError } = await supabase
      .from('payment_attempts')
      .insert({
        user_name: name,
        email: email,
        amount: amount,
        plan_type: determinedPlanType,
        status: paymentData.status,
        payment_id: paymentData.id.toString(),
        qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Erro ao salvar pagamento: ${dbError.message}`)
    }

    console.log('Payment attempt saved:', paymentAttempt.id)

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentData.id.toString(),
        status: paymentData.status,
        qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
        attempt_id: paymentAttempt.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})