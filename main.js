/* ==========================================================================
   SprayComply — Master Responsive Interactions & Mobile Logic
   ========================================================================== */
(function() {
  'use strict';

  /* --- 1. Sticky Navbar on Scroll --- */
  const nav = document.querySelector('.navbar');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- 2. Mobile Menu & Backdrop Controller --- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  // Ensure backdrop element exists
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop && nav) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function setMobileMenu(isOpen) {
    if (!links || !toggle) return;
    links.classList.toggle('open', isOpen);
    if (backdrop) backdrop.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    const iconMenu = toggle.querySelector('.icon-menu');
    const iconX = toggle.querySelector('.icon-x');
    if (iconMenu) iconMenu.style.display = isOpen ? 'none' : 'block';
    if (iconX) iconX.style.display = isOpen ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  if (toggle && links) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = links.classList.contains('open');
      setMobileMenu(!isOpen);
    });

    if (backdrop) {
      backdrop.addEventListener('click', () => setMobileMenu(false));
    }

    // Close on navigation click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setMobileMenu(false));
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        setMobileMenu(false);
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && links.classList.contains('open')) {
        setMobileMenu(false);
      }
    }, { passive: true });
  }

  /* --- 3. Active Nav Link Detection --- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.btn)').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* --- 4. Intersection Observer for Scroll Reveals --- */
  const faders = document.querySelectorAll('.fade-in');
  if (faders.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    faders.forEach(el => observer.observe(el));
  } else {
    faders.forEach(el => el.classList.add('visible'));
  }

  /* --- 5. Interactive FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close sibling open items
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* --- 6. Stats Counter Animation --- */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      let current = 0;
      const step = Math.ceil(target / 40) || 1;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = prefix + current.toLocaleString() + suffix;
      }, 30);
    });
  }

  const statSection = document.querySelector('.stats-bar');
  if (statSection && 'IntersectionObserver' in window) {
    let counted = false;
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        animateCounters();
        obs.disconnect();
      }
    }, { threshold: 0.25 }).observe(statSection);
  }

  /* --- 7. Toast Notification Utility --- */
  window.showToast = function(msg, duration) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast success';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration || 3200);
  };

  /* --- 8. Interactive Demo Form Handling --- */
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✓ Request received! Our Texas team will contact you within 15 minutes.');
      form.reset();
    });
  });

  document.querySelectorAll('button[data-demo], a[data-demo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.querySelector('form[data-demo]');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = form.querySelector('input, textarea');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 400);
        }
        showToast('📋 Ready! Fill in your details below to schedule your walkthrough.');
      } else {
        window.location.href = 'contact.html';
      }
    });
  });

  /* --- 9. Phone & WhatsApp Action Handlers --- */
  document.querySelectorAll('[data-call]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'tel:+15125550199';
    });
  });

  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://wa.me/15125550199?text=Hi%20SprayComply!%20I%27d%20like%20to%20learn%20more%20about%20your%20pesticide%20logging%20software.', '_blank');
    });
  });

  /* --- 10. Inject Floating WhatsApp Widget & Sticky Mobile Bar on Any Page --- */
  document.addEventListener('DOMContentLoaded', () => {
    // Inject Floating "Website by Truegridleaf.com" Badge if not already present
    if (!document.querySelector('.floating-agency-badge')) {
      const agencyBadge = document.createElement('a');
      agencyBadge.className = 'floating-agency-badge';
      agencyBadge.href = 'https://truegridleaf.com';
      agencyBadge.target = '_blank';
      agencyBadge.rel = 'noopener noreferrer';
      agencyBadge.setAttribute('aria-label', 'Website designed and developed by Truegridleaf.com');
      agencyBadge.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
        <span>Website by Truegridleaf.com</span>
      `;
      document.body.appendChild(agencyBadge);
    }

    // Inject Floating WhatsApp if not already present
    if (!document.querySelector('.floating-whatsapp')) {
      const waBtn = document.createElement('a');
      waBtn.className = 'floating-whatsapp';
      waBtn.href = 'https://wa.me/15125550199?text=Hi%20SprayComply!%20I%27d%20like%20to%20learn%20more%20about%20the%20pesticide%20spray%20logging%20app.';
      waBtn.target = '_blank';
      waBtn.rel = 'noopener noreferrer';
      waBtn.setAttribute('aria-label', 'Chat with us on WhatsApp');
      waBtn.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
      `;
      document.body.appendChild(waBtn);
    }

    // Inject Sticky Mobile Bottom Action Bar if not already present
    if (!document.querySelector('.mobile-action-bar')) {
      const bar = document.createElement('div');
      bar.className = 'mobile-action-bar';
      bar.innerHTML = `
        <a href="tel:+15125550199" class="action-btn btn-call" aria-label="Call SprayComply now">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Call Now
        </a>
        <a href="contact.html" class="action-btn btn-trial" aria-label="Start free 14-day trial">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          Free Trial
        </a>
      `;
      document.body.appendChild(bar);
    }
  });

})();
