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
    const { payment_id } = await req.json()

    if (!payment_id) {
      throw new Error('payment_id é obrigatório')
    }

    console.log('Checking payment status for:', payment_id)

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured')
    }

    // Check payment status in Mercado Pago
    const mercadoPagoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const paymentData = await mercadoPagoResponse.json()
    console.log('Mercado Pago status check:', mercadoPagoResponse.status)
    console.log('Payment data:', JSON.stringify(paymentData, null, 2))

    if (!mercadoPagoResponse.ok) {
      const errorDetail = paymentData.message || paymentData.error || JSON.stringify(paymentData)
      throw new Error(`Erro Mercado Pago (${mercadoPagoResponse.status}): ${errorDetail}`)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current payment attempt from database
    const { data: paymentAttempt, error: fetchError } = await supabase
      .from('payment_attempts')
      .select('*')
      .eq('payment_id', payment_id)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching payment attempt:', fetchError)
    }

    const currentStatus = paymentData.status
    const previousStatus = paymentAttempt?.status

    // Update payment status in database
    const { error: updateError } = await supabase
      .from('payment_attempts')
      .update({
        status: currentStatus,
        updated_at: new Date().toISOString(),
        ...(currentStatus === 'approved' ? { approved_at: new Date().toISOString() } : {}),
      })
      .eq('payment_id', payment_id)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
    }

    // If payment was just approved (status changed to approved)
    if (currentStatus === 'approved' && previousStatus !== 'approved' && paymentAttempt) {
      console.log('Payment approved! Activating plan...')
      
      const amount = parseFloat(paymentAttempt.amount)
      const email = paymentAttempt.email
      
      // Determine plan type based on amount
      let planType = 'busca'
      let isPremium = false
      
      if (amount === 29.99) {
        planType = 'destaque'
        isPremium = true // Featured on homepage
        console.log('Activating PLANO_DESTAQUE (Premium) for:', email)
      } else if (amount === 9.99) {
        planType = 'busca'
        isPremium = false // Only in search
        console.log('Activating PLANO_BUSCA for:', email)
      }

      // Update braider profile to activate plan
      const { data: profile, error: profileError } = await supabase
        .from('braider_profiles')
        .update({
          is_premium: isPremium,
          premium_since: new Date().toISOString(),
        })
        .eq('email', email)
        .select()
        .maybeSingle()

      if (profileError) {
        console.error('Error updating braider profile:', profileError)
      } else if (profile) {
        console.log('Braider profile updated successfully:', profile.id)
      } else {
        console.log('No braider profile found for email:', email)
      }

      // Update the plan_type in payment_attempts
      await supabase
        .from('payment_attempts')
        .update({ plan_type: planType })
        .eq('payment_id', payment_id)

      return new Response(
        JSON.stringify({
          success: true,
          payment_id: payment_id,
          status: currentStatus,
          status_detail: paymentData.status_detail,
          plan_activated: true,
          plan_type: planType,
          is_premium: isPremium,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: payment_id,
        status: currentStatus,
        status_detail: paymentData.status_detail,
        plan_activated: false,
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
