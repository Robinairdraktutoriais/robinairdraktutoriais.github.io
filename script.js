document.getElementById('abrir-menu').addEventListener('click', () => {
    document.getElementById('menu-lateral').classList.add('aberto');
    document.getElementById('conteudo-principal').classList.add('empurrado');
});

document.getElementById('fechar-menu').addEventListener('click', () => {
    document.getElementById('menu-lateral').classList.remove('aberto');
    document.getElementById('conteudo-principal').classList.remove('empurrado');
});
