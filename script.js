
// Js for header desktop(effect of background scroll, and colors too)
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  const desktopLinks = document.querySelectorAll('nav.lg\\:flex a');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      // Links DESKTOP: preto no header branco
      desktopLinks.forEach(link => {
        link.classList.add('text-black', 'hover:text-[#2A8C82]');
        link.classList.remove('text-white', 'hover:text-[#2A8C82]');
      });
    } else {
      header.classList.remove('scrolled');
      // Links DESKTOP: volta ao padrão (ex: branco se header transparente)
      desktopLinks.forEach(link => {
        link.classList.remove('text-black', 'hover:text-[#2A8C82]');
        link.classList.add('text-white', 'hover:text-[#2A8C82]');
      });
    }
  });
});

// Slider of MENU for mobile

// Menu mobile com animação
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    // Ativa o menu com a classe 'active'
    mobileMenu.classList.add('active');
    // Desabilita o scroll da página
    document.body.style.overflow = 'hidden';

    // Força um redesenho para garantir que as animações funcionem
    void mobileMenu.offsetWidth;
});

closeMenu.addEventListener('click', () => {
    // Remove a classe 'active' para iniciar as animações de saída
    mobileMenu.classList.remove('active');
    // Reabilita o scroll da página
    document.body.style.overflow = '';
});

// Fechar o menu ao clicar em qualquer link do menu mobile
const mobileLinks = document.querySelectorAll('.mobile-menu-link');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Fechar o menu ao pressionar Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});


// Js hover for sections
const sections = document.querySelectorAll('section');

// Configurar o Intersection Observer para animar todas as seções
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2 // A seção deve estar pelo menos 40% visível para ativar a animação
});

// Observar todas as seções
sections.forEach(section => {
  observer.observe(section);
});



// Modal code
// Slider of PROJECTS for modals
const sliders = {};

function nextSlide(sliderId) {
  const slider = document.getElementById(sliderId);
  const images = slider.querySelectorAll("img");

  if (!sliders[sliderId]) sliders[sliderId] = 0;

  sliders[sliderId] = (sliders[sliderId] + 1) % images.length;
  slider.style.transform = `translateX(-${sliders[sliderId] * 100}%)`;
}

function prevSlide(sliderId) {
  const slider = document.getElementById(sliderId);
  const images = slider.querySelectorAll("img");

  if (!sliders[sliderId]) sliders[sliderId] = 0;

  sliders[sliderId] = (sliders[sliderId] - 1 + images.length) % images.length;
  slider.style.transform = `translateX(-${sliders[sliderId] * 100}%)`;
}

// Open and close modal:
function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('active');
  document.body.classList.remove('body-modal-open');
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('active');
  document.body.classList.add('body-modal-open');

  // Reset slider position quando abre
  if (sliders[id.replace('modal-', 'slider-')] !== undefined) {
    sliders[id.replace('modal-', 'slider-')] = 0;
    const slider = document.getElementById(id.replace('modal-', 'slider-'));
    if (slider) slider.style.transform = 'translateX(0)';
  }

  modal.focus();
}

// Fechar modal ao clicar fora do conteúdo
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', function (e) {
    if (e.target === this) {
      closeModal(this.id);
    }
  });
});


// Background animado
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('grid-background');
  const ctx = canvas.getContext('2d');
  let time = 0;

  // Configurações ajustáveis
  const config = {
    lineColor: 'rgba(102, 101, 101, 0.2)', // Cor das linhas (verde água)
    lineWidth: 0.7,
    cellSize: 50, // Tamanho da célula do grid
    speed: 0.3 // Velocidade da animação
  };

  function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animate() {
    time += config.speed;
    drawGrid();
    requestAnimationFrame(animate);
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = config.lineColor;
    ctx.lineWidth = config.lineWidth;

    // Offset baseado no tempo para criar movimento
    const offsetX = time % config.cellSize;
    const offsetY = (time * 0.1) % config.cellSize;

    // Desenha linhas verticais
    for (let x = -config.cellSize + offsetX; x < canvas.width; x += config.cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Desenha linhas horizontais
    for (let y = -config.cellSize + offsetY; y < canvas.height; y += config.cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Adiciona pontos nas interseções para um efeito extra
    ctx.fillStyle = config.lineColor;
    for (let x = -config.cellSize + offsetX; x < canvas.width; x += config.cellSize) {
      for (let y = -config.cellSize + offsetY; y < canvas.height; y += config.cellSize) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  init();
});










// Fechar o menu mobile ao clicar em um link
document.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    // Fechar o menu mobile
    document.getElementById('mobile-menu').classList.remove('active');

    // Obter o alvo da âncora (como "#about")
    const targetId = this.getAttribute('href');

    // Rolar até a seção com um deslocamento para centralizar
    setTimeout(() => {
      scrollToSection(targetId);
    }, 300); // Pequeno atraso para permitir que o menu feche
  });
});




// Função para rolar até uma seção
function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);
  if (section) {
    // Verificar se é mobile (usando a mesma condição do seu CSS para mobile)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      // No mobile: rolar para o topo da seção (mostrando o título)
      const sectionTop = section.offsetTop;
      const headerHeight = document.querySelector('header').offsetHeight;

      window.scrollTo({
        top: sectionTop - headerHeight - 20, // Compensa o header fixo e dá um pequeno espaço
        behavior: 'smooth'
      });
    } else {
      // No desktop: comportamento de centralização original
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.pageYOffset;
      const windowHeight = window.innerHeight;
      const sectionHeight = sectionRect.height;

      const scrollTo = sectionTop - (windowHeight / 2) + (sectionHeight / 2);

      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  }
}

// Fechar o menu mobile ao clicar em um link
document.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    // Fechar o menu mobile
    document.getElementById('mobile-menu').classList.remove('active');

    // Obter o alvo da âncora
    const targetId = this.getAttribute('href');

    // Rolar até a seção
    setTimeout(() => {
      scrollToSection(targetId);
    }, 300); // Pequeno atraso para permitir que o menu feche
  });
});

// Mesmo comportamento para o menu desktop (opcional)
document.querySelectorAll('.menu-desktop a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    scrollToSection(targetId);
  });
});