/* =====================================================
   ALOG — Site JavaScript
   Mobile nav, scroll reveal, back-to-top, lightbox,
   property filter, contact form validation
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile hamburger nav --- */
  const burger = document.querySelector('.hamburger');
  const links  = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        links.classList.remove('open');
      })
    );
  }

  /* --- Back to top button --- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('visible', window.scrollY > 500);
    });
    toTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* --- Scroll reveal (IntersectionObserver) --- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('on'));
  }

  /* --- Lightbox for galleries --- */
  const lbImages = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (lbImages.length) {
    // Build lightbox DOM once
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lb-close" aria-label="Close">×</button>
      <button class="lb-nav lb-prev" aria-label="Previous">‹</button>
      <img alt="" />
      <button class="lb-nav lb-next" aria-label="Next">›</button>
    `;
    document.body.appendChild(lb);
    const img = lb.querySelector('img');
    let idx = 0;

    const open = (i) => {
      idx = i;
      img.src = lbImages[idx].dataset.lightbox || lbImages[idx].src;
      img.alt = lbImages[idx].alt || '';
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    };
    const nav = (d) => {
      idx = (idx + d + lbImages.length) % lbImages.length;
      img.src = lbImages[idx].dataset.lightbox || lbImages[idx].src;
      img.alt = lbImages[idx].alt || '';
    };

    lbImages.forEach((el, i) => el.addEventListener('click', () => open(i)));
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', () => nav(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => nav(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });
  }

  /* --- Property filter (Real Estate page) --- */
  const propGrid = document.getElementById('properties-grid');
  if (propGrid) {
    const searchInput = document.getElementById('f-search');
    const typeSel    = document.getElementById('f-type');
    const statusSel  = document.getElementById('f-status');
    const bedsSel    = document.getElementById('f-beds');
    const resetBtn   = document.getElementById('f-reset');

    const apply = () => {
      const q   = (searchInput.value || '').trim().toLowerCase();
      const t   = typeSel.value;
      const s   = statusSel.value;
      const b   = bedsSel.value;
      let shown = 0;

      propGrid.querySelectorAll('.prop-card').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const loc  = (card.dataset.location || '').toLowerCase();
        const type = card.dataset.type;
        const stat = card.dataset.status;
        const beds = parseInt(card.dataset.beds || '0', 10);

        const matchQ  = !q || name.includes(q) || loc.includes(q);
        const matchT  = !t || type === t;
        const matchS  = !s || stat === s;
        const matchB  = !b || (b === '4+' ? beds >= 4 : beds === parseInt(b, 10));

        const visible = matchQ && matchT && matchS && matchB;
        card.style.display = visible ? '' : 'none';
        if (visible) shown++;
      });

      const empty = document.getElementById('props-empty');
      if (empty) empty.style.display = shown === 0 ? 'block' : 'none';
    };

    [searchInput, typeSel, statusSel, bedsSel].forEach(el =>
      el && el.addEventListener('input', apply)
    );
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        typeSel.value = '';
        statusSel.value = '';
        bedsSel.value = '';
        apply();
      });
    }
  }

  /* --- Contact form validation --- */
  const form = document.getElementById('contact-form');
  if (form) {
    const success = form.querySelector('.form-success');

    const showErr = (field, msg) => {
      const wrap = field.closest('.form-field');
      wrap.classList.add('has-error');
      const el = wrap.querySelector('.error-msg');
      if (el && msg) el.textContent = msg;
    };
    const clearErr = (field) => field.closest('.form-field').classList.remove('has-error');

    const validate = () => {
      let ok = true;
      form.querySelectorAll('[data-required]').forEach(f => {
        clearErr(f);
        if (!f.value.trim()) { showErr(f, 'This field is required.'); ok = false; }
      });
      const email = form.querySelector('input[type=email]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showErr(email, 'Please enter a valid email.');
        ok = false;
      }
      const phone = form.querySelector('input[type=tel]');
      if (phone && phone.value && !/^[+()\-\s\d]{7,}$/.test(phone.value)) {
        showErr(phone, 'Please enter a valid phone number.');
        ok = false;
      }
      return ok;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (success) success.classList.remove('show');
      if (!validate()) return;
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });

    form.querySelectorAll('[data-required]').forEach(f => {
      f.addEventListener('input', () => clearErr(f));
    });
  }

  /* --- Active nav link underline --- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* --- iOS Safari: auto-fix 100vh (mobile address-bar shrink) --- */
  const setVH = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);

  /* --- "Add to Home Screen" install prompt (Android / Chrome) --- */
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    // Show a subtle install button if you want to surface it; for now we just
    // let the browser's own UI handle it.
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    console.log('[ALOG] Installed to home screen');
  });

});

/* --- Service worker registration (outside DOMContentLoaded for early load) --- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      console.log('[ALOG] Service worker registered:', reg.scope);
    }).catch(err => {
      console.warn('[ALOG] Service worker registration failed:', err);
    });
  });
}
