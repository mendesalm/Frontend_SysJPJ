document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const siteHeader = document.querySelector('.site-header');

    // Função para alternar o menu mobile
    const toggleMenu = () => {
        // Anima o ícone do menu (hamburger para X e vice-versa)
        mobileMenuIcon.classList.toggle('is-active');
        // Mostra ou esconde o menu de navegação
        navMenu.classList.toggle('active');

        // Impede a rolagem do corpo da página quando o menu mobile está aberto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    // Evento de clique no ícone do menu mobile
    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', toggleMenu);
    }

    // Evento de clique nos links do menu para fechar o menu mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu(); // Fecha o menu se estiver aberto
            }
            // Opcional: Lógica para destacar o link ativo (exemplo abaixo)
            // navLinks.forEach(l => l.classList.remove('active-link'));
            // link.classList.add('active-link');
        });
    });

    // Opcional: Adicionar um efeito à barra de navegação ao rolar a página
    const handleScroll = () => {
        if (siteHeader) { // Verifica se siteHeader existe
            if (window.scrollY > 50) { // Adiciona a classe 'scrolled' após rolar 50 pixels
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chama uma vez para definir o estado inicial no carregamento

    // Opcional: Fechar o menu se o usuário clicar fora dele (em telas mobile)
    document.addEventListener('click', (event) => {
        // Verifica se o menu está ativo e se o clique não foi no menu nem no ícone
        if (navMenu && mobileMenuIcon && navMenu.classList.contains('active')) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnMenuIcon = mobileMenuIcon.contains(event.target);

            if (!isClickInsideMenu && !isClickOnMenuIcon) {
                toggleMenu();
            }
        }
    });

    // Opcional: Atualizar link ativo ao rolar para seções (para Single Page Apps)
    // Esta é uma implementação básica. Pode precisar de ajustes para precisão.
    const sections = document.querySelectorAll('main section[id]');
    const updateActiveLinkOnScroll = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Considera a altura da navbar fixa
            if (pageYOffset >= (sectionTop - siteHeader.clientHeight - 50)) { // 50px de offset
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    };
    window.addEventListener('scroll', updateActiveLinkOnScroll);
    updateActiveLinkOnScroll(); // Chama no carregamento

});
