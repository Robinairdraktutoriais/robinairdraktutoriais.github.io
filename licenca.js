<script>
(function() {
  const DOMINIO_AUTORIZADO = 'dominioteste-bloqueado.com'; 
  const CHAVE_LICENCA = 'RT-TESTE';
  const dominiosLivres = ['localhost', '127.0.0.1'];
  const dominioAtual = window.location.hostname;

  const liberado = dominiosLivres.some(d => dominioAtual.includes(d)) || dominioAtual.includes(DOMINIO_AUTORIZADO);

  if (!liberado) {
    // Para o carregamento de todo resto
    window.stop();
    
    // Limpa e bloqueia tudo
    document.open();
    document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Licença Bloqueada</title>
      </head>
      <body style="background:#0a0a0a; color:#fff; font-family:Arial, sans-serif; margin:0; padding:0; overflow:hidden;">
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;">
          <div style="text-align:center; max-width:400px; width:100%;">
            <h1 style="color:#ff3b3b; font-size:24px; margin-bottom:16px; font-weight:bold;">ACESSO BLOQUEADO</h1>
            <p style="font-size:14px; margin:8px 0; line-height:1.4; color:#ccc;">Licença ${CHAVE_LICENCA} não autorizada para:</p>
            <p style="font-size:13px; margin:8px 0 20px 0; color:#888; word-break:break-all;">${dominioAtual}</p>
            <p style="margin:20px 0; font-size:14px;">Para adquirir uma licença, entre em contato:</p>
            <a href="https://t.me/rtmods" style="display:inline-block; background:#0088cc; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px;">
              Suporte Telegram @rtmods
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
    document.close();
    
    // Impede execução de qualquer outro script
    throw new Error('Script bloqueado por licença inválida.');
  }
})();
</script>