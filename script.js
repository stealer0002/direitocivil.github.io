document.addEventListener('DOMContentLoaded', () => {
    
    // --- Section Switching ---
    const preparatorioProva = document.getElementById('preparatorio-prova');
    const aprofundamentoDidatico = document.getElementById('aprofundamento-didatico');
    const navLinks = document.querySelectorAll('nav a');

    const toggleSection = (targetId) => {
        if (!preparatorioProva || !aprofundamentoDidatico) return;

        if (targetId === '#preparatorio-prova') {
            preparatorioProva.style.display = 'block';
            aprofundamentoDidatico.style.display = 'none';
        } else if (targetId === '#aprofundamento-didatico') {
            preparatorioProva.style.display = 'none';
            aprofundamentoDidatico.style.display = 'block';
        }
    };

    // Exibe apenas um bloco por vez (começa pelo preparatório)
    preparatorioProva.style.display = 'block';
    aprofundamentoDidatico.style.display = 'none';

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            toggleSection(targetId);

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

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

    // --- SISTEMA DE MODAL ---
    
    // 1. Injetar o HTML do Modal na página
    const modalHTML = `
        <div id="class-modal" class="modal-overlay">
            <div class="modal-content">
                <button class="close-modal-btn"><i class="fas fa-times"></i></button>
                <h2 id="modal-title" style="font-family: var(--font-display); color: var(--neon-cyan); margin-bottom: 20px;"></h2>
                <div id="modal-body" class="content-block" style="display: block; opacity: 1; max-height: none;">
                    <!-- Conteúdo será injetado aqui -->
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 2. Elementos do Modal
    const modal = document.getElementById('class-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    // Cria um preview curto dentro de cada card didático, espelhando o estilo da trilha de prova
    const addDidaticoPreviews = () => {
        document.querySelectorAll('.class-card').forEach(card => {
            const hidden = card.querySelector('.hidden-content');
            const readBtn = card.querySelector('.read-btn');
            if (!hidden || !readBtn) return;

            const firstParagraph = hidden.querySelector('p');
            if (firstParagraph) {
                const preview = document.createElement('p');
                preview.className = 'card-preview';
                const text = firstParagraph.textContent.trim();
                preview.textContent = text.length > 200 ? `${text.slice(0, 200)}…` : text;
                card.insertBefore(preview, readBtn);
            }
        });
    };

    addDidaticoPreviews();

    let modalPushed = false;

    // 3. Função para fechar o modal
    const closeModal = (fromHistory = false) => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Reativa o scroll da página
        if (modalPushed && !fromHistory) {
            window.history.back();
        }
        modalPushed = false;
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Fecha ao clicar fora
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Fecha o modal ao usar o botão voltar do mobile (popstate)
    window.addEventListener('popstate', () => {
        if (modal.classList.contains('active')) {
            closeModal(true);
        }
    });

    // 4. Lógica de clique nos cards
    const classCards = document.querySelectorAll('.class-card');
    classCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4').innerText;
            const content = card.querySelector('.hidden-content').innerHTML;

            modalTitle.innerText = title;
            modalBody.innerHTML = content;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Trava o scroll da página de fundo
            if (!modalPushed && window.history && window.history.pushState) {
                window.history.pushState({ modalOpen: true }, '');
                modalPushed = true;
            }
        });
    });

    // Smooth Scroll para links de âncora com tratamento de erro
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            toggleSection(targetId);
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
        });
    });

});
