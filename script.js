document.addEventListener('DOMContentLoaded', () => {
    
    // Configuração do Scroll Reveal (Intersection Observer)
    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    
    // Validação inicial
    if (elementsToReveal.length === 0) {
        console.warn('Nenhum elemento com classe .scroll-reveal encontrado');
    } else {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Para animar apenas uma vez
                }
            });
        }, observerOptions);

        elementsToReveal.forEach(el => observer.observe(el));

        // Cleanup ao descarregar
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
        }, { once: true });
    }

    // Lógica para expandir/colapsar os cards das aulas
    const classCards = document.querySelectorAll('.class-card');
    classCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Não fecha o card se clicar nos detalhes internos
            if (e.target.closest('details')) return;
            card.classList.toggle('expanded');
        });
    });

    // Smooth Scroll para links de âncora com tratamento de erro
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            // Validação do elemento alvo
            if (!target) {
                console.warn(`Elemento alvo ${targetId} não encontrado`);
                return;
            }
            
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }, { passive: true });
    });

});
