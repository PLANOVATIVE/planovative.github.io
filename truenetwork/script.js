class NetworkAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.animationId = null;
    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createNodes();
    this.createConnections();
    this.animate();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createNodes();
      this.createConnections();
    });
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createNodes() {
    this.nodes = [];
    const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 25000);

    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 2
      });
    }
  }

  createConnections() {
    this.connections = [];
    const maxDistance = 150;

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          this.connections.push({
            start: i,
            end: j,
            opacity: 1 - (distance / maxDistance)
          });
        }
      }
    }
  }

  updateNodes() {
    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.connections.forEach(conn => {
      const start = this.nodes[conn.start];
      const end = this.nodes[conn.end];

      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.strokeStyle = `rgba(30, 64, 175, ${conn.opacity * 0.3})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });

    this.nodes.forEach(node => {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(30, 64, 175, 0.6)';
      this.ctx.fill();
    });
  }

  animate() {
    this.updateNodes();
    this.createConnections();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

class StickyHeader {
  constructor() {
    this.header = document.getElementById('header');
    this.scrollThreshold = 50;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
    this.handleScroll();
  }

  handleScroll() {
    if (window.scrollY > this.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
}

class TabSystem {
  constructor() {
    this.tabButtons = document.querySelectorAll('.tab-button');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.init();
  }

  init() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => this.switchTab(e));
    });
  }

  switchTab(e) {
    const targetTab = e.target.dataset.tab;

    this.tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    this.tabContents.forEach(content => {
      content.classList.remove('active');
    });

    e.target.classList.add('active');
    e.target.setAttribute('aria-selected', 'true');

    const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  }
}

class FAQAccordion {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => this.toggleItem(item, question));
    });
  }

  toggleItem(item, question) {
    const isActive = item.classList.contains('active');

    this.faqItems.forEach(faq => {
      faq.classList.remove('active');
      const btn = faq.querySelector('.faq-question');
      btn.setAttribute('aria-expanded', 'false');
    });

    if (!isActive) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
    }
  }
}

class FeatureDropdown {
  constructor() {
    this.dropdownItems = document.querySelectorAll('.feature-dropdown-item');
    this.init();
  }

  init() {
    this.dropdownItems.forEach(item => {
      const button = item.querySelector('.feature-dropdown-button');
      button.addEventListener('click', () => this.toggleItem(item, button));
    });
  }

  toggleItem(item, button) {
    const isActive = item.classList.contains('active');

    if (isActive) {
      item.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  }
}

class MobileMenu {
  constructor() {
    this.toggle = document.querySelector('.mobile-menu-toggle');
    this.navList = document.querySelector('.nav-list');
    this.navActions = document.querySelector('.nav-actions');
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.toggle) return;

    this.toggle.addEventListener('click', () => this.toggleMenu());

    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('.site-header')) {
        this.closeMenu();
      }
    });

    if (this.navList) {
      this.navList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          this.closeMenu();
        }
      });
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.toggle.setAttribute('aria-expanded', this.isOpen);

    if (this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    if (this.navList) {
      this.navList.style.display = 'flex';
      this.navList.style.zIndex = '999';
    }

    if (this.navActions) {
      this.navActions.style.display = 'flex';
      this.navActions.style.zIndex = '999';

      setTimeout(() => {
        const navListHeight = this.navList ? this.navList.offsetHeight : 0;
        this.navActions.style.top = `calc(100% + ${navListHeight}px)`;
      }, 10);
    }
  }

  closeMenu() {
    this.isOpen = false;

    if (window.innerWidth <= 768) {
      if (this.navList) this.navList.style.display = 'none';
      if (this.navActions) this.navActions.style.display = 'none';
    }
  }
}

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('section, .feature-card, .solution-card, .sdg-card');
    this.init();
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    this.elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(element);
    });
  }
}

class FormHandler {
  constructor() {
    this.form = document.querySelector('.cta-form');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = this.form.querySelector('input[type="email"]').value;

      if (this.validateEmail(email)) {
        this.showSuccess();
      }
    });
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showSuccess() {
    const button = this.form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Success!';
    button.style.backgroundColor = '#2563eb';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
      this.form.reset();
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('networkCanvas');
  if (canvas) {
    new NetworkAnimation(canvas);
  }

  new StickyHeader();
  new TabSystem();
  new FAQAccordion();
  new FeatureDropdown();
  new MobileMenu();
  new ScrollAnimations();
  new FormHandler();
});
