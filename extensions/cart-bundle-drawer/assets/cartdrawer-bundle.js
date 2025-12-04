/* =====================================================================
   assets/xcart-drawer.js  (uses Shopify default price & compare_at_price)
   ===================================================================== */
(() => {
  const OPENERS = [
    '[data-cart-toggle]',
    '[data-action="open-drawer"][data-drawer-id*="cart"]',
    '[aria-controls*="cart"][data-action="open"]',
    '.cart-toggle',
    '.header__cart',
    '.open-cart-btn',
    'button[name="cart"]',
    'a[href="#cart-drawer"]',
    '.js-mini-cart-open',
    '.icon-cart',
    '.site-header__cart',
  ];
  const THEME_DRAWERS = [
    'cart-drawer',
    '.cart-drawer',
    '#CartDrawer',
    '.drawer--right',
    '.mini-cart',
    '.cart-sidebar',
  ];

  const drawer = document.getElementById('xcart-drawer');
  const overlay = document.getElementById('xcart-overlay');
  const lineList = document.getElementById('xcart-line-items');
  const subtotal = document.getElementById('xcart-subtotal');
  const checkoutBtn = document.getElementById('xcart-checkout');
  const currency = drawer?.getAttribute('data-xcart-currency') || 'USD';

  // If markup is missing, bail out
  if (!drawer || !overlay || !lineList || !subtotal) return;

  // ---- Utils ----
  const money = (cents) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
      }).format((cents || 0) / 100);
    } catch {
      return `$${((cents || 0) / 100).toFixed(2)}`;
    }
  };

  const productImg = (src) =>
    src ? src.replace(/(\.jpg|\.jpeg|\.png|\.webp)(?!\?)/i, '$1?width=128') : '';

  async function fetchCart() {
    const r = await fetch('/cart.js', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    return await r.json();
  }

  function render(cart) {
    lineList.innerHTML = '';

    if (!cart.items?.length) {
      lineList.innerHTML = '<span role="status">Your cart is empty.</span>';
      subtotal.textContent = money(cart.items_subtotal_price || 0);
      return;
    }

    cart.items.forEach((it) => {
      const current = Number.isFinite(it.price) ? it.price : 0; // unit price
      const compare =
        Number.isFinite(it.compare_at_price) && it.compare_at_price > current
          ? it.compare_at_price
          : null;

      const row = document.createElement('div');
      row.className = 'xcart-line';
      row.setAttribute('role', 'listitem');
      row.dataset.key = it.key;

      row.innerHTML = `
        <img
          class="xcart-line__img"
          alt="${(it.title || '').replace(/"/g, '&quot;')}"
          src="${productImg(it.image)}"
        />
        <div>
          <span class="xcart-line__title">${it.product_title}</span>
          <div class="xcart-line__meta">${it.variant_title || ''}</div>
          <button
            class="xcart-remove"
            data-key="${it.key}"
            aria-label="Remove ${it.product_title}"
          >
            Remove
          </button>
        </div>
        <div>
          <div class="xcart-qty" aria-label="Quantity for ${it.product_title}">
            <button
              type="button"
              class="xcart-qty-dec"
              data-key="${it.key}"
              aria-label="Decrease"
            >
              −
            </button>
            <input
              type="number"
              class="xcart-qty-input"
              min="0"
              step="1"
              value="${it.quantity}"
              data-key="${it.key}"
              inputmode="numeric"
            />
            <button
              type="button"
              class="xcart-qty-inc"
              data-key="${it.key}"
              aria-label="Increase"
            >
              ＋
            </button>
          </div>

          <!-- Unit price with compare-at (Shopify defaults) -->
          <div class="xcart-price">
            ${compare
          ? `<span class="xcart-price--compare">${money(compare)}</span>`
          : ``
        }
            <span class="xcart-price--current">${money(current)}</span>
          </div>

          <!-- Line total (uses final_line_price if present, else line_price) -->
          <div
            class="xcart-line-total"
            style="text-align:right;margin-top:6px"
          >
            ${money(
          Number.isFinite(it.final_line_price)
            ? it.final_line_price
            : it.line_price
        )}
          </div>
        </div>
      `;

      lineList.appendChild(row);
    });

    subtotal.textContent = money(cart.items_subtotal_price || 0);
  }

  async function ensureFreshCart() {
    const cart = await fetchCart();
    render(cart);
    return cart;
  }

  async function openDrawer() {
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    drawer.focus?.({ preventScroll: true });
    await ensureFreshCart();
  }

  function closeDrawer() {
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    document.documentElement.style.overflow = '';
  }

  function hideThemeDrawers() {
    THEME_DRAWERS.forEach((sel) => {
      document
        .querySelectorAll(sel)
        .forEach((el) => el.style.setProperty('display', 'none', 'important'));
    });
  }

  function bindOpeners(root = document) {
    root.querySelectorAll(OPENERS.join(',')).forEach((btn) => {
      if (btn.__xcartBound) return;
      btn.__xcartBound = true;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });
  }

  // ---- Cart API via KEY ----
  let busyMutation = false;

  async function changeQuantityByKey(key, quantity) {
    if (!key) return;

    const q = Math.max(
      0,
      Math.min(999, Number.isFinite(+quantity) ? +quantity : 0)
    );
    if (busyMutation) return;
    busyMutation = true;

    try {
      const body = new URLSearchParams({ id: key, quantity: String(q) });
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded; charset=UTF-8',
          Accept: 'application/json',
        },
        body,
      });
      const cart = await res.json();
      render(cart);
      return cart;
    } catch (e) {
      console.warn('change.js failed', e);
    } finally {
      busyMutation = false;
    }
  }

  const removeByKey = (key) => changeQuantityByKey(key, 0);

  // ---- Add-to-cart interception ----
  function interceptAddToCart() {
    // Form submits
    document.addEventListener('submit', async (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;

      const action = (form.getAttribute('action') || '').replace(
        location.origin,
        ''
      );
      if (!/\/cart\/add(\.js)?/i.test(action)) return;
      if (!form.hasAttribute('data-ajax') && !/\.js$/i.test(action)) return;

      e.preventDefault();
      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
      } catch (err) {
        console.warn('add.js error', err);
      }
      openDrawer();
    });

    // Custom/theme events
    window.addEventListener('cart:added', openDrawer, { passive: true });
    document.addEventListener('product:added', openDrawer, { passive: true });
    document.addEventListener('ajaxProduct:added', openDrawer, {
      passive: true,
    });
    document.addEventListener('theme:cart:updated', openDrawer, {
      passive: true,
    });

    // Patch fetch to listen to cart/add
    const _fetch = window.fetch;
    window.fetch = async function (input, init) {
      const res = await _fetch(input, init);
      try {
        const url = typeof input === 'string' ? input : input.url;
        if (/\/cart\/add(\.js)?/i.test(url)) queueMicrotask(openDrawer);
      } catch {
        // ignore
      }
      return res;
    };
  }

  // ---- Checkout: show up-to-date info, then go to Shopify checkout ----
  if (checkoutBtn && !checkoutBtn.__xcartBound) {
    checkoutBtn.__xcartBound = true;
    checkoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await ensureFreshCart();
      setTimeout(() => {
        window.location.assign('/checkout');
      }, 50);
    });
  }

  // ---- Events ----
  document.addEventListener('click', (e) => {
    if (e.target instanceof Element) {
      if (
        e.target.closest('[data-xcart-close]') ||
        e.target === overlay
      ) {
        closeDrawer();
        return;
      }

      const inc = e.target.closest('.xcart-qty-inc');
      if (inc) {
        const key = inc.getAttribute('data-key');
        const input = lineList.querySelector(
          `.xcart-qty-input[data-key="${CSS.escape(key)}"]`
        );
        const val = parseInt(input?.value || '0', 10) || 0;
        changeQuantityByKey(key, val + 1);
        return;
      }

      const dec = e.target.closest('.xcart-qty-dec');
      if (dec) {
        const key = dec.getAttribute('data-key');
        const input = lineList.querySelector(
          `.xcart-qty-input[data-key="${CSS.escape(key)}"]`
        );
        const val = parseInt(input?.value || '0', 10) || 0;
        changeQuantityByKey(key, Math.max(0, val - 1));
        return;
      }

      const rm = e.target.closest('.xcart-remove');
      if (rm) {
        removeByKey(rm.getAttribute('data-key'));
        return;
      }

      if (e.target.matches('#xcart-apply-discount')) {
        const code = (
          document.getElementById('xcart-discount-input')?.value || ''
        ).trim();
        if (code) {
          window.location.assign(
            '/discount/' + encodeURIComponent(code) + '?redirect=/cart'
          );
        }
      }
    }
  });

  document.addEventListener('change', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.matches('.xcart-qty-input')) {
      const key = target.getAttribute('data-key');
      const val = parseInt(target.value, 10);
      changeQuantityByKey(key, Number.isInteger(val) ? val : 0);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });

  // ---- Bootstrap ----
  function init() {
    bindOpeners();
    hideThemeDrawers();
    interceptAddToCart();
  }

  const mo = new MutationObserver(() => {
    bindOpeners();
    hideThemeDrawers();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      mo.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    });
  } else {
    init();
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
