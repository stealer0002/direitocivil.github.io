function openTab(tabId) {
    // Esconde todas as seções
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    // Desativa botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Ativa o alvo
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleCard(header) {
    const body = header.nextElementSibling;
    const icon = header.querySelector('.icon');
    const isOpen = body.style.maxHeight;

    // Fecha todos
    document.querySelectorAll('.card-body').forEach(el => el.style.maxHeight = null);
    document.querySelectorAll('.icon').forEach(el => el.style.transform = 'rotate(0deg)');

    // Abre o atual se estava fechado
    if (!isOpen) {
        body.style.maxHeight = body.scrollHeight + "px";
        icon.style.transform = 'rotate(180deg)';
        setTimeout(() => header.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
    }
}
