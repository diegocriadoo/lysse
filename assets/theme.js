/* Lyssé — theme.js (sin dependencias) */
(() => {
  'use strict';

  const theme = window.theme || { routes: {}, strings: {} };
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Formato de precio (formato de moneda de Shopify) ---------- */
  function formatMoney(cents, format = theme.moneyFormat || '{{amount_with_comma_separator}} €') {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    const toParts = (value, precision, thousands = ',', decimal = '.') => {
      const n = (Number(value) / 100).toFixed(precision);
      const [int, dec] = n.split('.');
      const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return dec ? intFmt + decimal + dec : intFmt;
    };
    return format.replace(/\{\{\s*(\w+)\s*\}\}/, (_, key) => {
      switch (key) {
        case 'amount': return toParts(cents, 2);
        case 'amount_no_decimals': return toParts(cents, 0);
        case 'amount_with_comma_separator': return toParts(cents, 2, '.', ',');
        case 'amount_no_decimals_with_comma_separator': return toParts(cents, 0, '.');
        case 'amount_with_apostrophe_separator': return toParts(cents, 2, "'");
        case 'amount_with_space_separator': return toParts(cents, 2, ' ', ',');
        default: return toParts(cents, 2);
      }
    });
  }

  /* ---------- Bloqueo de scroll y foco ---------- */
  let lastFocus = null;
  const lockScroll = (on) => document.body.classList.toggle('is-locked', on);
  function trapFocus(container, event) {
    if (event.key !== 'Tab') return;
    const focusables = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
    else if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
  }

  /* ---------- Menú móvil ---------- */
  function initMobileNav() {
    const nav = $('[data-mobile-nav]');
    const openBtn = $('[data-menu-open]');
    if (!nav || !openBtn) return;
    const open = () => {
      lastFocus = document.activeElement;
      nav.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
      lockScroll(true);
      $('[data-menu-close]', nav)?.focus();
    };
    const close = () => {
      nav.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      lockScroll(false);
      (lastFocus || openBtn).focus();
    };
    openBtn.addEventListener('click', open);
    $$('[data-menu-close]', nav).forEach((b) => b.addEventListener('click', close));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => { if (nav.classList.contains('is-open')) close(); }));
    nav.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); trapFocus(nav, e); });
  }

  /* ---------- Galería ---------- */
  function initGallery() {
    $$('[data-gallery]').forEach((gallery) => {
      const slides = $$('[data-slide]', gallery);
      const thumbs = $$('[data-thumb]', gallery);
      const show = (i) => {
        slides.forEach((s, idx) => { s.classList.toggle('is-active', idx === i); s.setAttribute('aria-hidden', idx === i ? 'false' : 'true'); });
        thumbs.forEach((t, idx) => t.setAttribute('aria-current', idx === i ? 'true' : 'false'));
      };
      thumbs.forEach((t) => t.addEventListener('click', () => show(Number(t.dataset.thumb))));
    });
  }

  /* ---------- Cantidad ---------- */
  function initQty(root = document) {
    $$('[data-qty]', root).forEach((wrap) => {
      const input = $('input', wrap);
      const clamp = (v) => Math.max(Number(input.min) || 1, Math.min(Number(input.max) || 99, v || 1));
      $('[data-qty-minus]', wrap)?.addEventListener('click', () => { input.value = clamp(Number(input.value) - 1); });
      $('[data-qty-plus]', wrap)?.addEventListener('click', () => { input.value = clamp(Number(input.value) + 1); });
      input.addEventListener('change', () => { input.value = clamp(Number(input.value)); });
    });
  }

  /* ---------- Producto: variantes + añadir al carrito ---------- */
  function setButtonState(button, variant) {
    const label = $('[data-add-label]', button);
    if (!variant) {
      button.disabled = true;
      if (label) label.textContent = theme.strings.unavailable;
    } else if (!variant.available) {
      button.disabled = true;
      if (label) label.textContent = theme.strings.soldOut;
    } else {
      button.disabled = false;
      if (label) label.textContent = button.dataset.label || theme.strings.addToCart;
    }
  }

  function initProductRoots() {
    $$('[data-product-root]').forEach((root) => {
      let variants = [];
      try { variants = JSON.parse($('[data-variants]', root)?.textContent || '[]'); } catch (e) { variants = []; }
      const form = $('form', root);
      if (!form) return;
      const idInput = $('[data-variant-id]', form);
      const button = $('[data-add-button]', form);
      const errorBox = $('[data-form-error]', form);

      const currentVariant = () => variants.find((v) => String(v.id) === String(idInput.value));

      const updatePrice = (variant) => {
        if (!variant) return;
        const price = $('[data-price]', root);
        const compare = $('[data-compare]', root);
        const compareLabel = $('[data-compare-label]', root);
        const save = $('[data-save]', root);
        if (price) price.textContent = formatMoney(variant.price);
        const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
        if (compare) { compare.hidden = !onSale; compare.textContent = onSale ? formatMoney(variant.compare_at_price) : ''; }
        if (compareLabel) compareLabel.hidden = !onSale;
        if (save) {
          save.hidden = !onSale;
          save.textContent = onSale ? `-${Math.floor(((variant.compare_at_price - variant.price) * 100) / variant.compare_at_price)}%` : '';
        }
      };

      $$('input[data-option-index]', form).forEach((input) => {
        input.addEventListener('change', () => {
          const selected = [];
          $$('fieldset', form).forEach((fs, i) => {
            const checked = $('input:checked', fs);
            selected[i] = checked ? checked.value : null;
            const label = $(`[data-option-label="${i}"]`, fs);
            if (label && checked) label.textContent = checked.value;
          });
          const variant = variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
          if (variant) idInput.value = variant.id;
          setButtonState(button, variant);
          updatePrice(variant);
          if (root.hasAttribute('data-primary')) {
            document.dispatchEvent(new CustomEvent('theme:variant-change', { detail: { variant } }));
            if (variant && window.history.replaceState && /\/products\//.test(location.pathname)) {
              const url = new URL(location.href);
              url.searchParams.set('variant', variant.id);
              window.history.replaceState({}, '', url.toString());
            }
          }
        });
      });

      form.addEventListener('submit', async (event) => {
        if (!window.fetch) return;
        event.preventDefault();
        if (button.disabled) return;
        errorBox.hidden = true;
        button.classList.add('is-loading');
        button.setAttribute('aria-busy', 'true');
        const label = $('[data-add-label]', button);
        const original = label ? label.textContent : '';
        if (label) label.textContent = theme.strings.adding;
        try {
          const body = new FormData(form);
          body.append('sections', 'cart-drawer');
          body.append('sections_url', window.location.pathname);
          const res = await fetch(`${theme.routes.cartAdd}.js`, { method: 'POST', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body });
          const data = await res.json();
          if (!res.ok || data.status) throw new Error(data.description || data.message || theme.strings.cartError);
          if (data.sections && data.sections['cart-drawer']) CartDrawer.render(data.sections['cart-drawer']);
          else await CartDrawer.refresh();
          CartDrawer.open(button);
        } catch (err) {
          errorBox.textContent = err.message || theme.strings.cartError;
          errorBox.hidden = false;
        } finally {
          button.classList.remove('is-loading');
          button.removeAttribute('aria-busy');
          if (label) label.textContent = original;
          setButtonState(button, currentVariant() || { available: !button.disabled });
        }
      });
    });
  }

  /* ---------- Carrito lateral ---------- */
  const CartDrawer = {
    el: null,
    init() {
      this.el = $('[data-cart-drawer]');
      if (!this.el) return;
      document.addEventListener('click', (e) => {
        const opener = e.target.closest('[data-cart-open]');
        if (opener) { e.preventDefault(); this.open(opener); return; }
        if (e.target.closest('[data-cart-close]')) { this.close(); return; }
        const change = e.target.closest('[data-line-change]');
        if (change && this.el.contains(change)) this.change(change.dataset.lineChange, Number(change.dataset.qtyValue));
      });
      this.el.addEventListener('change', (e) => {
        const input = e.target.closest('[data-line-input]');
        if (input) this.change(input.dataset.lineInput, Math.max(0, Number(input.value) || 0));
      });
      this.el.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); trapFocus($('.drawer__panel', this.el), e); });
    },
    open(trigger) {
      if (!this.el) return;
      lastFocus = trigger || document.activeElement;
      this.el.classList.add('is-open');
      lockScroll(true);
      requestAnimationFrame(() => $('.drawer__panel', this.el).focus());
    },
    close() {
      if (!this.el || !this.el.classList.contains('is-open')) return;
      this.el.classList.remove('is-open');
      lockScroll(false);
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    },
    render(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-cart-drawer]');
      if (!fresh) return;
      $('.drawer__panel', this.el).innerHTML = $('.drawer__panel', fresh).innerHTML;
      const count = fresh.dataset.count || '0';
      $$('[data-cart-count]').forEach((c) => { c.textContent = count; c.dataset.count = count; });
    },
    async refresh() {
      const res = await fetch(`${theme.routes.root}?sections=cart-drawer`);
      const data = await res.json();
      if (data['cart-drawer']) this.render(data['cart-drawer']);
    },
    async change(line, quantity) {
      this.el.classList.add('is-busy');
      try {
        const res = await fetch(`${theme.routes.cartChange}.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ line: Number(line), quantity, sections: ['cart-drawer'], sections_url: window.location.pathname })
        });
        const data = await res.json();
        if (data.sections && data.sections['cart-drawer']) this.render(data.sections['cart-drawer']);
        else await this.refresh();
      } catch (e) {
        await this.refresh();
      } finally {
        this.el.classList.remove('is-busy');
        $('.drawer__panel', this.el).focus();
      }
    }
  };

  /* ---------- Sticky add to cart ---------- */
  function initStickyAtc() {
    const bar = $('[data-sticky-atc]');
    const primary = $('[data-product-root][data-primary]');
    if (!bar || !primary) return;
    const form = $('form', primary);
    const addBtn = $('[data-sticky-add]', bar);
    const finalCta = $('[data-final-cta]');
    const footer = $('.footer');
    let primaryVisible = true;
    let endVisible = false;

    const update = () => {
      const show = !primaryVisible && !endVisible;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      addBtn.tabIndex = show ? 0 : -1;
    };

    // Visible mientras el formulario principal está en pantalla o aún no se ha llegado a él
    const io = new IntersectionObserver(([entry]) => {
      primaryVisible = entry.isIntersecting || entry.boundingClientRect.top > 0;
      update();
    }, { threshold: 0 });
    io.observe(primary);
    const ends = [finalCta, footer].filter(Boolean);
    const ioEnd = new IntersectionObserver(() => {
      endVisible = ends.some((el) => { const r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; });
      update();
    }, { threshold: 0 });
    ends.forEach((el) => ioEnd.observe(el));

    addBtn.addEventListener('click', () => {
      if (form.requestSubmit) form.requestSubmit($('[data-add-button]', form));
      else $('[data-add-button]', form).click();
    });

    document.addEventListener('theme:variant-change', (e) => {
      const v = e.detail.variant;
      const price = $('[data-sticky-price]', bar);
      const label = $('[data-sticky-label]', bar);
      if (v && price) price.textContent = formatMoney(v.price);
      addBtn.disabled = !v || !v.available;
      if (label) {
        if (!label.dataset.default) label.dataset.default = label.textContent;
        label.textContent = !v ? theme.strings.unavailable : v.available ? label.dataset.default : theme.strings.soldOut;
      }
    });
  }

  /* ---------- Hotspots ---------- */
  function initHotspots() {
    $$('[data-hotspots]').forEach((section) => {
      const spots = $$('[data-hotspot]', section);
      const items = $$('[data-feature]', section);
      const media = $('.hotspot-media', section);
      let current = 0;
      const activate = (i, scroll) => {
        current = Number(i);
        spots.forEach((s) => s.setAttribute('aria-pressed', s.dataset.hotspot === String(i) ? 'true' : 'false'));
        items.forEach((it) => it.classList.toggle('is-active', it.dataset.feature === String(i)));
        if (scroll && window.innerWidth < 990) {
          const target = items.find((it) => it.dataset.feature === String(i));
          target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
      };
      spots.forEach((s) => s.addEventListener('click', () => activate(s.dataset.hotspot, true)));
      items.forEach((it) => it.addEventListener('mouseenter', () => activate(it.dataset.feature, false)));
      if (spots.length) activate(0, false);

      // Deslizar (dedo o ratón) sobre la foto para pasar al siguiente/anterior punto
      if (media && spots.length > 1 && !media.dataset.swipeReady) {
        media.dataset.swipeReady = 'true';
        let startX = 0, startY = 0, dragging = false, moved = false;
        media.addEventListener('pointerdown', (e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          dragging = true; moved = false; startX = e.clientX; startY = e.clientY;
        });
        media.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          const dx = e.clientX - startX, dy = e.clientY - startY;
          if (!moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) moved = true;
          if (moved) e.preventDefault();
        });
        const end = (e) => {
          if (!dragging) return;
          dragging = false;
          if (!moved) return;
          const dx = e.clientX - startX;
          if (Math.abs(dx) > 40) {
            const next = Math.min(spots.length - 1, Math.max(0, current + (dx < 0 ? 1 : -1)));
            if (next !== current) activate(next, true);
          }
        };
        media.addEventListener('pointerup', end);
        media.addEventListener('pointercancel', () => { dragging = false; });
      }
    });
  }

  /* ---------- Carrusel: deslizar, arrastrar con ratón y flechas ---------- */
  function initCarousels() {
    $$('[data-carousel]').forEach((wrap) => {
      if (wrap.dataset.carouselReady) return;
      wrap.dataset.carouselReady = 'true';
      const track = $('[data-carousel-track]', wrap);
      const prev = $('[data-carousel-prev]', wrap);
      const next = $('[data-carousel-next]', wrap);
      if (!track) return;

      const step = () => {
        const card = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 14;
        return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        if (prev) prev.hidden = track.scrollLeft <= 4;
        if (next) next.hidden = track.scrollLeft >= max - 4;
      };
      prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
      next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
      });

      // Arrastrar con el ratón (el dedo ya desliza de forma nativa)
      let startX = 0, startLeft = 0, dragging = false, moved = false;
      track.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        dragging = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      });
      window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('is-dragging'); }
        if (moved) track.scrollLeft = startLeft - dx;
      });
      const end = () => {
        if (!dragging) return;
        dragging = false;
        if (!moved) return;
        // Al soltar, se recoloca en la tarjeta más cercana
        track.classList.remove('is-dragging');
        const s = step();
        track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: reduceMotion ? 'auto' : 'smooth' });
      };
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
      update();
    });
  }

  /* ---------- Fotos de reseñas: miniatura que se amplía al tocarla ---------- */
  function initReviewPhotos() {
    $$('[data-review-lightbox]').forEach((dialog) => {
      if (dialog.dataset.ready) return;
      dialog.dataset.ready = 'true';
      const img = document.createElement('img');
      img.decoding = 'async';
      dialog.appendChild(img);
      const scope = dialog.closest('section') || document;
      $$('[data-review-photo]', scope).forEach((btn) => btn.addEventListener('click', () => {
        if (typeof dialog.showModal !== 'function') { window.open(btn.dataset.reviewPhoto, '_blank'); return; }
        img.src = btn.dataset.reviewPhoto;
        img.alt = btn.getAttribute('aria-label') || '';
        dialog.showModal();
      }));
      $('[data-review-lightbox-close]', dialog)?.addEventListener('click', () => dialog.close());
      // Tocar fuera de la foto también la cierra
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => { img.removeAttribute('src'); });
    });
  }

  /* ---------- Reveal al hacer scroll ---------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Acordeones: uno abierto por grupo ---------- */
  function initAccordions() {
    $$('.faq-list, .product-info__accordions').forEach((group) => {
      const items = $$('details', group);
      items.forEach((d) => d.addEventListener('toggle', () => {
        if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
      }));
    });
  }

  function init() {
    initMobileNav();
    initGallery();
    initQty();
    initProductRoots();
    CartDrawer.init();
    initStickyAtc();
    initHotspots();
    initCarousels();
    initReviewPhotos();
    initAccordions();
    initReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Recarga de secciones en el editor de temas
  document.addEventListener('shopify:section:load', () => { initReveal(); initGallery(); initQty(); initHotspots(); initCarousels(); initReviewPhotos(); initAccordions(); });
})();
