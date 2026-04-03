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
    const { token, name, email, cpf, amount, planType, installments = 1, payment_method_id, issuer_id } = await req.json()

    console.log('Creating card payment:', { name, email, amount, planType, installments, payment_method_id })

    if (!token || !name || !email || !cpf || !amount) {
      throw new Error('Campos obrigatórios: token, name, email, cpf, amount')
    }

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured')
    }

    const cleanCpf = cpf.replace(/\D/g, '')
    if (cleanCpf.length !== 11) {
      throw new Error('CPF inválido - deve conter 11 dígitos')
    }

    const determinedPlanType = amount >= 29.99 ? 'premium' : amount >= 9.99 ? 'pro' : planType || 'basic'

    // Create payment with card token
    const paymentBody: any = {
      transaction_amount: amount,
      token: token,
      description: `Plano ${determinedPlanType.toUpperCase()} - Trancei`,
      installments: installments,
      payment_method_id: payment_method_id,
      payer: {
        email: email,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || name,
        identification: {
          type: 'CPF',
          number: cleanCpf,
        },
      },
    }

    if (issuer_id) {
      paymentBody.issuer_id = issuer_id
    }

    const mercadoPagoResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(paymentBody),
    })

    const paymentData = await mercadoPagoResponse.json()
    console.log('Mercado Pago status:', mercadoPagoResponse.status)
    console.log('Payment response:', JSON.stringify(paymentData, null, 2))

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
        payment_method: 'credit_card',
        ...(paymentData.status === 'approved' ? { approved_at: new Date().toISOString() } : {}),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Erro ao salvar pagamento: ${dbError.message}`)
    }

    // If approved, activate plan
    if (paymentData.status === 'approved') {
      const isPremium = amount >= 29.99
      
      const { data: profile } = await supabase
        .from('braider_profiles')
        .update({
          is_premium: isPremium,
          premium_since: new Date().toISOString(),
          plan_tier: isPremium ? 'premium' : 'pro',
          status: 'active',
          trial_ends_at: null,
        })
        .eq('email', email)
        .select()
        .maybeSingle()

      if (profile) {
        console.log('Profile activated:', profile.id)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentData.id.toString(),
        status: paymentData.status,
        status_detail: paymentData.status_detail,
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
