(function() {
  const DOMINIOS_LIBERADOS = ['localhost']; // só localhost libera
  const dominioAtual = location.hostname;
  
  console.log('Dominio atual:', dominioAtual); // isso aparece no F12
  
  if (!DOMINIOS_LIBERADOS.includes(dominioAtual)) {
    document.documentElement.innerHTML = '<h1>BLOQUEADO: ' + dominioAtual + '</h1>';
    throw new Error('Bloqueado');
  } else {
    console.log('Acesso liberado');
  }
})();