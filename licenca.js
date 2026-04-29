<head>
<script>
(function() {
  const DOMINIOS_AUTORIZADOS = [
    'dominioteste-bloqueado.com',
    'seuuser.github.io', // COLOCA SEU USER AQUI
    'localhost',
    '127.0.0.1'
  ];
  const CHAVE_LICENCA = 'RT-TESTE';
  const dominioAtual = window.location.hostname;

  const liberado = DOMINIOS_AUTORIZADOS.some(d => dominioAtual === d || dominioAtual.endsWith('.' + d));

  if (!liberado) {
    // Mata tudo antes de renderizar
    document.documentElement.innerHTML = `
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Licença Bloqueada</title>
      </head>
      <body style="background:#0a0a0a; color:#fff; font-family:Arial,sans-serif; margin:0; display:flex; align-items:center; justify-content:center; height:100vh; text-align:center; padding:20px;">
        <div style="max-width:400px;">
          <h1 style="color:#ff3b3b; font-size:24px; margin-bottom:16px;">ACESSO BLOQUEADO</h1>
          <p style="font-size:14px; color:#ccc;">Licença ${CHAVE_LICENCA} não autorizada para:</p>
          <p style="font-size:13px; color:#888; word-break:break-all; margin-bottom:20px;">${dominioAtual}</p>
          <a href="https://t.me/rtmods" style="display:inline-block; background:#0088cc; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold;">
            Suporte @rtmods
          </a>
        </div>
      </body>
    `;
    throw new Error('Bloqueado por licença: ' + dominioAtual);
  }
})();
</script>
<!-- resto do seu head -->
</head>