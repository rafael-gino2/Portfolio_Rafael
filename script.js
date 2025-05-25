// Configurações globais
const config = {
  scrollThreshold: 50,
  animationThreshold: 0.2,
  gridConfig: {
    lineColor: 'rgba(102, 101, 101, 0.2)',
    lineWidth: 0.7,
    cellSize: 50,
    speed: 0.3
  }
};

// Cache de elementos DOM
const domElements = {
  header: document.querySelector('header'),
  desktopLinks: document.querySelectorAll('nav.lg\\:flex a'),
  menuToggle: document.getElementById('menu-toggle'),
  closeMenu: document.getElementById('close-menu'),
  mobileMenu: document.getElementById('mobile-menu'),
  mobileLinks: document.querySelectorAll('.mobile-menu-link'),
  sections: document.querySelectorAll('section'),
  canvas: document.getElementById('grid-background')
};

// Estado da aplicação
const appState = {
  sliders: {}
};

// Funções utilitárias
const utils = {
  scrollToSection: (sectionId) => {
    const section = document.querySelector(sectionId);
    if (!section) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const headerHeight = domElements.header.offsetHeight;
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.pageYOffset;

    if (isMobile) {
      window.scrollTo({
        top: sectionTop - headerHeight - 20,
        behavior: 'smooth'
      });
    } else {
      const windowHeight = window.innerHeight;
      const sectionHeight = sectionRect.height;
      const scrollTo = sectionTop - (windowHeight / 2) + (sectionHeight / 2);

      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  },

  handleLinkClick: (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');

    if (domElements.mobileMenu.classList.contains('active')) {
      domElements.mobileMenu.classList.remove('active');
      document.body.style.overflow = '';

      setTimeout(() => {
        utils.scrollToSection(targetId);
      }, 300);
    } else {
      utils.scrollToSection(targetId);
    }
  }
};

// Controle do menu mobile
const mobileMenu = {
  init: () => {
    domElements.menuToggle.addEventListener('click', mobileMenu.open);
    domElements.closeMenu.addEventListener('click', mobileMenu.close);

    domElements.mobileLinks.forEach(link => {
      link.addEventListener('click', utils.handleLinkClick);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && domElements.mobileMenu.classList.contains('active')) {
        mobileMenu.close();
      }
    });
  },

  open: () => {
    domElements.mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    void domElements.mobileMenu.offsetWidth; // Força repaint para animação
  },

  close: () => {
    domElements.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Controle do header
const headerControl = {
  init: () => {
    // Aplicar estilos iniciais
    domElements.desktopLinks.forEach(link => {
      link.classList.add('text-white', 'hover:text-[#2A8C82]');
    });

    // Desktop links
    document.querySelectorAll('.menu-desktop a').forEach(link => {
      link.addEventListener('click', utils.handleLinkClick);
    });

    // Scroll handler
    window.addEventListener('scroll', headerControl.handleScroll);
  },

  handleScroll: () => {
    if (window.scrollY > config.scrollThreshold) {
      domElements.header.classList.add('scrolled');
      domElements.desktopLinks.forEach(link => {
        link.classList.add('text-black', 'hover:text-[#2A8C82]');
        link.classList.remove('text-white');
      });
    } else {
      domElements.header.classList.remove('scrolled');
      domElements.desktopLinks.forEach(link => {
        link.classList.remove('text-black');
        link.classList.add('text-white', 'hover:text-[#2A8C82]');
      });
    }
  }
};

// Animação de seções
const sectionObserver = {
  init: () => {
    const observer = new IntersectionObserver(sectionObserver.handleIntersection, {
      threshold: config.animationThreshold
    });

    domElements.sections.forEach(section => {
      observer.observe(section);
    });
  },

  handleIntersection: (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // observer.unobserve(entry.target); // Descomente se quiser que a animação ocorra apenas uma vez
      }
    });
  }
};

// Controle de modais
const modalControl = {
  init: () => {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          modalControl.close(this.id);
        }
      });
    });
  },

  nextSlide: (sliderId) => {
    const slider = document.getElementById(sliderId);
    const images = slider.querySelectorAll("img");

    if (!appState.sliders[sliderId]) appState.sliders[sliderId] = 0;

    appState.sliders[sliderId] = (appState.sliders[sliderId] + 1) % images.length;
    slider.style.transform = `translateX(-${appState.sliders[sliderId] * 100}%)`;
  },

  prevSlide: (sliderId) => {
    const slider = document.getElementById(sliderId);
    const images = slider.querySelectorAll("img");

    if (!appState.sliders[sliderId]) appState.sliders[sliderId] = 0;

    appState.sliders[sliderId] = (appState.sliders[sliderId] - 1 + images.length) % images.length;
    slider.style.transform = `translateX(-${appState.sliders[sliderId] * 100}%)`;
  },

  close: (id) => {
    const modal = document.getElementById(id);
    modal.classList.remove('active');
    document.body.classList.remove('body-modal-open');
  },

  open: (id) => {
    const modal = document.getElementById(id);
    modal.classList.add('active');
    document.body.classList.add('body-modal-open');

    // Reset slider position
    const sliderId = id.replace('modal-', 'slider-');
    if (appState.sliders[sliderId] !== undefined) {
      appState.sliders[sliderId] = 0;
      const slider = document.getElementById(sliderId);
      if (slider) slider.style.transform = 'translateX(0)';
    }

    modal.focus();
  }
};

// Background animado
const gridBackground = {
  init: () => {
    if (!domElements.canvas) return;

    const ctx = domElements.canvas.getContext('2d');
    let time = 0;

    const resizeCanvas = () => {
      domElements.canvas.width = window.innerWidth;
      domElements.canvas.height = window.innerHeight;
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, domElements.canvas.width, domElements.canvas.height);
      ctx.strokeStyle = config.gridConfig.lineColor;
      ctx.lineWidth = config.gridConfig.lineWidth;

      const offsetX = time % config.gridConfig.cellSize;
      const offsetY = (time * 0.1) % config.gridConfig.cellSize;

      // Linhas verticais
      for (let x = -config.gridConfig.cellSize + offsetX; x < domElements.canvas.width; x += config.gridConfig.cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, domElements.canvas.height);
        ctx.stroke();
      }

      // Linhas horizontais
      for (let y = -config.gridConfig.cellSize + offsetY; y < domElements.canvas.height; y += config.gridConfig.cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(domElements.canvas.width, y);
        ctx.stroke();
      }

      // Pontos nas interseções
      ctx.fillStyle = config.gridConfig.lineColor;
      for (let x = -config.gridConfig.cellSize + offsetX; x < domElements.canvas.width; x += config.gridConfig.cellSize) {
        for (let y = -config.gridConfig.cellSize + offsetY; y < domElements.canvas.height; y += config.gridConfig.cellSize) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = () => {
      time += config.gridConfig.speed;
      drawGrid();
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
  }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
  mobileMenu.init();
  headerControl.init();
  sectionObserver.init();
  modalControl.init();
  gridBackground.init();
});

// Exportar funções globais necessárias
window.nextSlide = modalControl.nextSlide;
window.prevSlide = modalControl.prevSlide;
window.closeModal = modalControl.close;
window.openModal = modalControl.open;