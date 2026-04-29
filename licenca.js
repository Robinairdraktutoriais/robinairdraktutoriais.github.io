// licenca.js
(function() {
  const DOMINIOS_LIBERADOS = [
    'localhost',
    '127.0.0.1'
    // 'none.github.io' // adiciona quando quiser liberar
  ];
  
  const CHAVE_LICENCA = 'RT-TESTE';
  const dominioAtual = location.hostname;

  if (!DOMINIOS_LIBERADOS.includes(dominioAtual)) {
    // Mata qualquer coisa que ainda ia carregar
    if (window.stop) window.stop();
    
    // Apaga o documento inteiro e reescreve
    document.open();
    document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Licença Bloqueada</title></head><body style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;margin:0;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:20px;box-sizing:border-box;"><div style="max-width:400px;width:100%;"><h1 style="color:#ff3b3b;font-size:24px;margin-bottom:16px;font-weight:bold;">ACESSO BLOQUEADO</h1><p style="font-size:14px;margin:8px 0;line-height:1.4;color:#ccc;">Licença ' + CHAVE_LICENCA + ' não autorizada para:</p><p style="font-size:13px;margin:8px 0 20px 0;color:#888;word-break:break-all;">' + dominioAtual + '</p><p style="margin:20px 0;font-size:14px;">Para adquirir uma licença, entre em contato:</p><a href="https://t.me/rtmods" style="display:inline-block;background:#0088cc;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Suporte Telegram @rtmods</a></div></body></html>');
    document.close();
    
    // Para o JS completamente
    throw new Error('Licença inválida: ' + dominioAtual);
  }
})();