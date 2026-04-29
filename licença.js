(function() {
  const DOMINIO_AUTORIZADO = 'paineldocliente.com'; 
  const CHAVE_LICENCA = 'RT-002'; // muda a chave
  
  const dominiosLivres = ['localhost', '127.0.0.1', 'robinairdraktutoriais.github.io'];
  const dominioAtual = window.location.hostname;

  const liberado = dominiosLivres.some(d => dominioAtual.includes(d)) || dominioAtual.includes(DOMINIO_AUTORIZADO);

  if (!liberado) {
    document.documentElement.innerHTML = `<head><title>Licença Bloqueada</title></head><body style="background:#0a0a0a;color:#fff;font-family:Arial;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px;"><div><h1 style="color:#ff3b3b;font-size:28px;margin-bottom:16px;">ACESSO BLOQUEADO</h1><p style="font-size:16px;margin:8px 0;">Licença ${CHAVE_LICENCA} não autorizada para este domínio.</p><p style="margin:24px 0;">Para adquirir uma licença, entre em contato:</p><a href="https://t.me/rtmods" style="background:#0088cc;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Suporte Telegram @rtmods</a></div></body>`;
    throw new Error('Script bloqueado por licença inválida.');
  }
})();