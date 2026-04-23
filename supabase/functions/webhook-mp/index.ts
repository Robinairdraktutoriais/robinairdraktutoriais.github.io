import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const body = await req.json()
    
    // MP manda notificação quando pagamento é criado/atualizado
    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      // Consulta o pagamento direto no MP pra evitar fraude
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` }
      })
      const payment = await mpRes.json()
      
      // Só adiciona saldo se foi aprovado mesmo
      if (payment.status === 'approved') {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )
        
        // Busca nossa transação interna
        const { data: transacao } = await supabase
          .from('transacoes')
          .select('*')
          .eq('id', payment.external_reference)
          .single()
        
        if (transacao) {
          // Chama a função SQL que adiciona saldo com segurança
          await supabase.rpc('adicionar_saldo', { 
            p_user_id: transacao.user_id, 
            p_valor: transacao.valor,
            p_transacao_id: transacao.id
          })
        }
      }
    }
    
    return new Response('ok', { status: 200 })
  } catch (error) {
    return new Response('error', { status: 500 })
  }
})