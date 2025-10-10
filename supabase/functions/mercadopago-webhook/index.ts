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
    const body = await req.json()
    console.log('Webhook received:', body)

    // Mercado Pago sends notifications with type and data.id
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id

      // Get payment details from Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')}`,
        },
      })

      const paymentData = await paymentResponse.json()
      console.log('Payment data:', paymentData)

      // Update database
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const updateData: any = {
        status: paymentData.status,
        updated_at: new Date().toISOString(),
      }

      if (paymentData.status === 'approved') {
        updateData.approved_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('payment_attempts')
        .update(updateData)
        .eq('payment_id', paymentId.toString())

      if (updateError) {
        console.error('Database update error:', updateError)
        throw updateError
      }

      console.log('Payment status updated successfully')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})