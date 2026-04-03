import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "https://esm.sh/resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Webhook received:', JSON.stringify(body))

    // Mercado Pago sends notifications with type and data.id
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id
      console.log('Processing payment ID:', paymentId)

      // Get payment details from Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')}`,
        },
      })

      const paymentData = await paymentResponse.json()
      console.log('Payment data from MP:', JSON.stringify({
        id: paymentData.id,
        status: paymentData.status,
        payer_email: paymentData.payer?.email
      }))

      // Update database
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const updateData: any = {
        status: paymentData.status,
        updated_at: new Date().toISOString(),
      }

      const isApproved = paymentData.status === 'approved'
      if (isApproved) {
        updateData.approved_at = new Date().toISOString()
      }

      // First get the payment attempt to get user info
      const { data: paymentAttempt, error: fetchError } = await supabase
        .from('payment_attempts')
        .select('*')
        .eq('payment_id', paymentId.toString())
        .single()

      if (fetchError) {
        console.error('Error fetching payment attempt:', fetchError)
      }

      // Update payment attempt status
      const { error: updateError } = await supabase
        .from('payment_attempts')
        .update(updateData)
        .eq('payment_id', paymentId.toString())

      if (updateError) {
        console.error('Database update error:', updateError)
        throw updateError
      }

      // If approved, update the braider profile and create subscription record
      if (isApproved && paymentAttempt) {
        // Find the user's braider profile
        const { data: profile, error: profileError } = await supabase
          .from('braider_profiles')
          .select('id, user_id')
          .eq('email', paymentAttempt.email)
          .maybeSingle()

        if (profile) {
          // Update profile to premium and active
          await supabase
            .from('braider_profiles')
            .update({
              is_premium: true,
              plan_tier: paymentAttempt.plan_type === 'premium' ? 'premium' : 'pro',
              status: 'active',
              trial_ends_at: null, // Clear trial if they paid
              premium_since: new Date().toISOString()
            })
            .eq('id', profile.id)

          // Insert subscription record
          await supabase
            .from('subscriptions')
            .insert({
              user_id: profile.user_id,
              braider_id: profile.id,
              plan_type: paymentAttempt.plan_type === 'premium' ? 'premium' : 'pro',
              status: 'approved',
              amount: paymentAttempt.amount,
              payment_date: new Date().toISOString(),
              mercado_pago_id: paymentId.toString()
            })
        }
      }

      console.log('Payment status updated successfully')

      // Send confirmation email if payment is approved
      if (paymentData.status === 'approved' && paymentAttempt?.email) {
        console.log('Sending confirmation email to:', paymentAttempt.email)
        
        try {
          const planName = paymentAttempt.plan_type === 'premium' ? 'Plano Premium' : 'Plano Básico'
          const amount = paymentAttempt.amount?.toFixed(2) || '0.00'
          
          const emailResponse = await resend.emails.send({
            from: 'Trancistas <onboarding@resend.dev>',
            to: [paymentAttempt.email],
            subject: '✅ Pagamento Aprovado - Bem-vinda ao Trancistas!',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                  .header { background: linear-gradient(135deg, #8B5CF6, #D946EF); padding: 40px 20px; text-align: center; }
                  .header h1 { color: white; margin: 0; font-size: 28px; }
                  .content { padding: 40px 30px; }
                  .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
                  .info-box { background: #f8f4ff; border-radius: 12px; padding: 20px; margin: 20px 0; }
                  .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
                  .info-row:last-child { border-bottom: none; }
                  .label { color: #666; }
                  .value { font-weight: bold; color: #333; }
                  .cta-button { display: block; width: 100%; background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 30px; }
                  .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 Pagamento Aprovado!</h1>
                  </div>
                  <div class="content">
                    <div class="success-icon">✅</div>
                    <p>Olá <strong>${paymentAttempt.user_name}</strong>,</p>
                    <p>Seu pagamento foi aprovado com sucesso! Agora você faz parte da comunidade de trancistas.</p>
                    
                    <div class="info-box">
                      <div class="info-row">
                        <span class="label">Plano:</span>
                        <span class="value">${planName}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">Valor:</span>
                        <span class="value">R$ ${amount}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">Data:</span>
                        <span class="value">${new Date().toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <p>Agora você pode criar seu perfil e começar a receber clientes!</p>
                    
                    <a href="https://trancistas.lovable.app/perfil/editar" class="cta-button">
                      Criar meu perfil
                    </a>
                  </div>
                  <div class="footer">
                    <p>Este email foi enviado automaticamente pelo sistema Trancistas.</p>
                    <p>Em caso de dúvidas, entre em contato conosco.</p>
                  </div>
                </div>
              </body>
              </html>
            `,
          })

          console.log('Email sent successfully:', JSON.stringify(emailResponse))
        } catch (emailError) {
          console.error('Error sending email:', emailError)
          // Don't throw - we don't want to fail the webhook because of email issues
        }
      }
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
