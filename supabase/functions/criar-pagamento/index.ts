import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { valor, user_id } = await req.json()
    
    if (!valor || !user_id) {
      throw new Error('Valor e user_id são obrigatórios')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Cria transação pendente
    const { data: transacao, error: dbError } = await supabase
      .from('transacoes')
      .insert({ user_id, valor, status: 'pendente' })
      .select()
      .single()
    
    if (dbError) throw dbError

    // 2. Cria cobrança Pix no Mercado Pago
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': transacao.id
      },
      body: JSON.stringify({
        transaction_amount: Number(valor),
        description: `Recarga Saldo SMM`,
        payment_method_id: 'pix',
        payer: { email: 'cliente@email.com' },
        external_reference: transacao.id,
        notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-mp`
      })
    })

    const mpData = await mpResponse.json()
    if (!mpResponse.ok) throw new Error(mpData.message)

    // 3. Salva ID do MP
    await supabase
      .from('transacoes')
      .update({ mp_payment_id: mpData.id })
      .eq('id', transacao.id)

    return new Response(JSON.stringify({
      qr_code: mpData.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: mpData.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: mpData.id
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})