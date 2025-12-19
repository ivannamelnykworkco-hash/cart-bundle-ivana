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

  // ---- App proxy settings (cached) ----
  let cartDrawerSettingsPromise = null;
  function getCartDrawerSettings() {
    if (!cartDrawerSettingsPromise) {
      cartDrawerSettingsPromise = fetch('/apps/cart-drawer-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load cart drawer settings');
          return res.json();
        })
        .catch((err) => {
          console.error('Fetch /apps/cart-drawer-settings error:', err);
          return null;
        });
    }
    return cartDrawerSettingsPromise;
  }

  // ---- Render cart ----
  async function render(cart) {
    lineList.innerHTML = '';

    if (!cart.items?.length) {
      lineList.innerHTML = '<span role="status">Your cart is empty.</span>';
      subtotal.textContent = money(cart.items_subtotal_price || 0);
      return;
    }

    // Fetch app-proxy settings ONCE per render
    let qbListArray = [];
    let xyListArray = [];
    let buListArray = [];
    let gsListArray = [];

    try {
      const products = await getCartDrawerSettings();
      if (Array.isArray(products) && products[0]) {
        const product = products[0] || {};
        qbListArray = product.qbList || [];
        xyListArray = product.xyList || [];
        buListArray = product.buList || [];
        gsListArray = product.gsList || [];
        console.log("qbListArray==>", qbListArray);
      }
    } catch (err) {
      console.error('Settings parse error:', err);
    }

    cart.items.forEach((it) => {
      console.log('it=======>', it);
      const current = Number.isFinite(it.price) ? it.price : 0; // unit price
      const compare =
        Number.isFinite(it.compare_at_price) && it.compare_at_price > current
          ? it.compare_at_price
          : null;

      // selected product id (safe)
      const selected = gsListArray?.[0].selectedProducts
        ? gsListArray?.[0].selectedProducts.split(',').map((id) => id.trim())
        : [];
      const selectedProductIds = selected
        .map((gid) => {
          const match = gid.match(/\/Product\/(\d+)/);
          return match ? match[1] : null;
        })
        .filter(Boolean);
      /////////////////////////////////////////////////
      /// selected product calculation




      /////////////////////////view cart drawer

      const row = document.createElement('div');
      row.className = 'xcart-line-wrapper';

      row.setAttribute('role', 'listitem');
      row.dataset.key = it.key;

      let html = `
      <div class="xcart-line">
        <img class="xcart-line__img" alt="${(it.title || '').replace(/"/g, '&quot;')}" src="${productImg(it.image)}" />
        <div class="xcart-line_title-with-qty">
          <span class="xcart-line__title">${it.product_title}</span>
          <div class="xcart-line__meta">${it.variant_title || ''}</div>
          <div class="xcart-qty-with-delete-btn">
            <div class="xcart-qty" aria-label="Quantity for ${it.product_title}">
              <button type="button" class="xcart-qty-dec" data-key="${it.key}" aria-label="Decrease">−</button>
              <input type="number" class="xcart-qty-input" min="0" step="1" value="${it.quantity}" data-key="${it.key}" />
              <button type="button" class="xcart-qty-inc" data-key="${it.key}" aria-label="Increase">＋</button>
            </div>
            <button class="xcart-remove" data-key="${it.key}" aria-label="Remove ${it.product_title}">
              <svg width="20" height="14" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.602 3.0418H12.3555V2.3925C12.3555 1.87588 12.1502 1.38042 11.7849 1.01511C11.4196 0.649806 10.9242 0.44458 10.4076 0.44458H6.51172C5.9951 0.44458 5.49964 0.649806 5.13433 1.01511C4.76903 1.38042 4.5638 1.87588 4.5638 2.3925V3.0418H1.31727C1.14507 3.0418 0.979914 3.11021 0.858146 3.23198C0.736378 3.35375 0.667969 3.5189 0.667969 3.69111C0.667969 3.86331 0.736378 4.02847 0.858146 4.15024C0.979914 4.272 1.14507 4.34041 1.31727 4.34041H1.96658V16.0279C1.96658 16.3723 2.1034 16.7026 2.34693 16.9462C2.59047 17.1897 2.92078 17.3265 3.26519 17.3265H13.6541C13.9985 17.3265 14.3288 17.1897 14.5723 16.9462C14.8159 16.7026 14.9527 16.3723 14.9527 16.0279V4.34041H15.602C15.7742 4.34041 15.9394 4.272 16.0611 4.15024C16.1829 4.02847 16.2513 3.86331 16.2513 3.69111C16.2513 3.5189 16.1829 3.35375 16.0611 3.23198C15.9394 3.11021 15.7742 3.0418 15.602 3.0418ZM5.86241 2.3925C5.86241 2.22029 5.93082 2.05514 6.05259 1.93337C6.17436 1.8116 6.33951 1.74319 6.51172 1.74319H10.4076C10.5798 1.74319 10.7449 1.8116 10.8667 1.93337C10.9884 2.05514 11.0569 2.22029 11.0569 2.3925V3.0418H5.86241V2.3925ZM13.6541 16.0279H3.26519V4.34041H13.6541V16.0279ZM7.16102 7.58694V12.7814C7.16102 12.9536 7.09262 13.1187 6.97085 13.2405C6.84908 13.3623 6.68393 13.4307 6.51172 13.4307C6.33951 13.4307 6.17436 13.3623 6.05259 13.2405C5.93082 13.1187 5.86241 12.9536 5.86241 12.7814V7.58694C5.86241 7.41474 5.93082 7.24958 6.05259 7.12781C6.17436 7.00604 6.33951 6.93764 6.51172 6.93764C6.68393 6.93764 6.84908 7.00604 6.97085 7.12781C7.09262 7.24958 7.16102 7.41474 7.16102 7.58694ZM11.0569 7.58694V12.7814C11.0569 12.9536 10.9884 13.1187 10.8667 13.2405C10.7449 13.3623 10.5798 13.4307 10.4076 13.4307C10.2353 13.4307 10.0702 13.3623 9.94842 13.2405C9.82665 13.1187 9.75825 12.9536 9.75825 12.7814V7.58694C9.75825 7.41474 9.82665 7.24958 9.94842 7.12781C10.0702 7.00604 10.2353 6.93764 10.4076 6.93764C10.5798 6.93764 10.7449 7.00604 10.8667 7.12781C10.9884 7.24958 11.0569 7.41474 11.0569 7.58694Z" fill="black"></path>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div class="xcart-line-total" style="text-align:right;">
          ${money(Number.isFinite(it.final_line_price) ? it.final_line_price : it.line_price)}
          </div>
          <div class="xcart-price">
            ${compare ? `<span class="xcart-price--compare">${money(compare)}</span>` : ''}
            <span class="xcart-price--current">${money(current)}</span>
          </div>
        </div>
      </div>
      `
      if (selectedProductIds.includes(String(it.product_id))) {
        html +=
          `
          <div id="xcart-bundle-app">
            <div class="xcart-bundle-app--header"><span>BUNDLE &amp; SAVE</span></div>
          `;

        // ----- QB bundles -----
        qbListArray.forEach((bundleItem) => {
          const upsellArray = Array.isArray(bundleItem.upsellItems)
            ? bundleItem.upsellItems
            : [];

          const basePrice = it.price;
          const discountPrice = bundleItem.discountPrice;
          const quantity = bundleItem.quantity;
          const selectPrice = bundleItem.selectPrice;

          let base = quantity * basePrice;
          let calc = base;
          if (selectPrice === 'discounted%') {
            calc = quantity * basePrice * (1 - discountPrice / 100);
          } else if (selectPrice === 'discounted$') {
            calc = quantity * (basePrice - discountPrice);
          } else if (selectPrice === 'specific') {
            calc = discountPrice;
          } else {
            calc = quantity * basePrice;
          }
          html += `
                <div class="xcart-main-quantity-break" data-bundle-id="${bundleItem.id}">
                  <div class="xcart-main-quantity-break--container">
                    <div class="xcart-bundle_bar_most_popular">
            `;
          if (bundleItem.badgeStyle === 'Simple' && bundleItem.badgeText) {
            html += `
                        <div class="xcart-bundle_bar_most_popular_content">${bundleItem.badgeText}</div>
              `;
          } else if (bundleItem.badgeStyle === 'mostpopular') {
            html += `
                        <div class="xcart-bundle_bar_most_popular_fancy">
                          <!-- SVG omitted for brevity; keep your original SVG here -->
                        </div>
              `;
          }

          html += `
                    </div>
                  </div>
                  <div class="xcart-main-section--container">
                    <div class="xcart-main-section--wrapper">        
                      <div class="xcart-bundle-content">        
                        <div class="xcart-bundle-text">
                            <div class="xcart-bundle-checkbox-body">.</div>
                          <div class="xcart-bundle-left">
                            <div class="xcart-bundle-title-with-label">
                              <span class="xcart-bundle-title">${bundleItem.title || ''}</span>
                              <span class="xcart-bundle-label">${bundleItem.label || ''}</span>
                            </div>
                            <div class="xcart-bundle-subtitle">${bundleItem.subtitle || ''}</div>            
                          </div>            
                        </div>
                        <div class="xcart--bundle-price">
                          <div class="xcart-bundle-discounted-price">${money(calc)}</div>
                          <div class="xcart-bundle-full-price">
                            <span>${money(base)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
            `;

          upsellArray.forEach((upsellItem) => {
            console.log("upsellArray==>", upsellArray);
            const imageUrl = upsellItem?.selectedProduct?.[0]?.imageUrl;
            html += `
                <div class="xcart-upsell-container">
                  <div class="xcart-upsell-checkbox-with-product--info">
                    <input type="checkbox">
                    <div class="xcart-upsell-img" style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px">
                     <img style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px" src="${imageUrl || ''}" alt="${upsellItem.title || ''}" />
                    </div>
                    <div class="xcart-upsell-product-title">${upsellItem.priceText || ''}</div>
                  </div> 
                  <div class="xcart-upsell-prices">
                    <div class="xcart-upsell-original-price">$${(upsellItem.calc || '')}</div>
                    <div class="xcart-upsell-current-price">$${upsellItem.base || ''}</div>
                  </div>
                </div>
              `;
          });

          html += `
            </div> <!-- end xcart-main-section--container -->
          </div> <!-- end xcart-main-quantity-break -->
          `;
        });

        // ----- XY bundles -----
        xyListArray.forEach((bundleItem) => {
          const upsellArray = Array.isArray(bundleItem.upsellItems)
            ? bundleItem.upsellItems
            : [];
          html += `
                <div class="xcart-main-quantity-break" data-bundle-id="${bundleItem.id}">
                  <div class="xcart-main-quantity-break--container">
                    <div class="xcart-bundle_bar_most_popular">
            `;
          if (bundleItem.badgeStyle === 'Simple' && bundleItem.badgeText) {
            html += `
                        <div class="xcart-bundle_bar_most_popular_content">${bundleItem.badgeText}</div>
              `;
          } else if (bundleItem.badgeStyle === 'mostpopular') {
            html += `
                        <div class="xcart-bundle_bar_most_popular_fancy">
                          <!-- SVG omitted for brevity; keep your original SVG here -->
                        </div>
              `;
          }

          html += `
                    </div>
                  </div>
                  <div class="xcart-main-section--container">
                    <div class="xcart-main-section--wrapper">        
                      <div class="xcart-bundle-content">        
                        <div class="xcart-bundle-text">
                            <div class="xcart-bundle-checkbox-body">.</div>
                          <div class="xcart-bundle-left">
                            <div class="xcart-bundle-title-with-label">
                              <span class="xcart-bundle-title">${bundleItem.title || ''}</span>
                              <span class="xcart-bundle-label">${bundleItem.label || ''}</span>
                            </div>
                            <div class="xcart-bundle-subtitle">${bundleItem.subtitle || ''}</div>            
                          </div>            
                        </div>
                        <div class="xcart--bundle-price">
                          <div class="xcart-bundle-discounted-price">${money(current)}</div>
                          <div class="xcart-bundle-full-price">
                            <span>${money(Number.isFinite(it.final_line_price) ? it.final_line_price : it.line_price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
            `;

          upsellArray.forEach((upsellItem) => {
            html += `
                <div class="xcart-upsell-container">
                  <div class="xcart-upsell-checkbox-with-product--info">
                    <input type="checkbox">
                    <div class="xcart-upsell-img"><img src="${upsellItem.imageUrl || ''}" alt="${upsellItem.title || ''}" /></div>
                    <div class="xcart-upsell-product-title">${upsellItem.priceText || ''}</div>
                  </div>
                  <div class="xcart-upsell-prices">
                    <div class="xcart-upsell-original-price">$${upsellItem.discountPrice || ''}</div>
                    <div class="xcart-upsell-current-price">$${upsellItem.selectPrice || ''}</div>
                  </div>
                </div>
              `;
          });

          html += `
            </div> <!-- end xcart-main-section--container -->
          </div> <!-- end xcart-main-quantity-break -->
          `;
        });

        // ----- Bundle upsell -----
        buListArray.forEach((bundleItem) => {
          const upsellArray = Array.isArray(bundleItem.upsellItems)
            ? bundleItem.upsellItems
            : [];
          const productArray = Array.isArray(bundleItem.productItems)
            ? bundleItem.productItems
            : [];
          html += `
                <div class="xcart-main-quantity-break" data-bundle-id="${bundleItem.id}">
                  <div class="xcart-main-quantity-break--container">
                    <div class="xcart-bundle_bar_most_popular">
            `;
          if (bundleItem.badgeStyle === 'Simple' && bundleItem.badgeText) {
            html += `
                        <div class="xcart-bundle_bar_most_popular_content">${bundleItem.badgeText}</div>
              `;
          } else if (bundleItem.badgeStyle === 'mostpopular') {
            html += `
                        <div class="xcart-bundle_bar_most_popular_fancy">
                          <!-- SVG omitted for brevity; keep your original SVG here -->
                        </div>
              `;
          }

          html += `
                    </div>
                  </div>
                  <div class="xcart-main-section--container">
                    <div class="xcart-main-section--wrapper">        
                      <div class="xcart-bundle-content">        
                        <div class="xcart-bundle-text">
                            <div class="xcart-bundle-checkbox-body">.</div>
                          <div class="xcart-bundle-left">
                            <div class="xcart-bundle-title-with-label">
                              <span class="xcart-bundle-title">${bundleItem.title || ''}</span>
                              <span class="xcart-bundle-label">${bundleItem.label || ''}</span>
                            </div>
                            <div class="xcart-bundle-subtitle">${bundleItem.subtitle || ''}</div>            
                          </div>            
                        </div>
                        <div class="xcart--bundle-price">
                          <div class="xcart-bundle-discounted-price">${money(current)}</div>
                          <div class="xcart-bundle-full-price">
                            <span>${money(Number.isFinite(it.final_line_price) ? it.final_line_price : it.line_price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="xcart-bundles__bundle-products">
            `;

          productArray.forEach((productItem) => {
            html += `
                <div class="xcart-bundles__bunlde-products--product">
                  <div class="xcart-bundles__bundle-products__link">
                    <img alt="" class="xcart-bundles__bundle-products__image" height="50" width="50" src="https://cdn.shopify.com/s/files/1/0922/2415/9928/files/snowboard_purple_hydrogen_200x200.png?v=1763374257">
                  </div>
                  <div class="xcart-bundles__bundle-products__link">
                    <div class="xcart-bundles__bundle-products__title">
                      <span>The Inventory Not Tracked Snowboard</span>
                    </div>
                  </div>
                  <div class="xcart-bundles__bundle-products__pricing">
                    <span class="xcart-bundles__bundle-products__price">$20</span>
                    <span class="xcart-bundles__bundle-products__full-price">$30</span>
                  </div>
                </div>
    
                <div class="xcart-bundles__bundle-products__divider">
                  <div class="xcart-bundles__bundle-products__divider-line"></div>
                  <div class="xcart-bundles__bundle-products__divider-icon"><svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor"></circle><path fill="#fff" d="M5 9h10v2H5z"></path><path fill="#fff" d="M11 5v10H9V5z"></path></svg></div>
                  <div class="xcart-bundles__bundle-products__divider-line"></div>
                </div>
              `;
          });

          html += `
             </div>
            `;

          upsellArray.forEach((upsellItem) => {
            html += `
                <div class="xcart-upsell-container">
                  <div class="xcart-upsell-checkbox-with-product--info">
                    <input type="checkbox">
                    <div class="xcart-upsell-img"><img src="${upsellItem.imageUrl || ''}" alt="${upsellItem.title || ''}" /></div>
                    <div class="xcart-upsell-product-title">${upsellItem.priceText || ''}</div>
                  </div>
                  <div class="xcart-upsell-prices">
                    <div class="xcart-upsell-original-price">$${upsellItem.discountPrice || ''}</div>
                    <div class="xcart-upsell-current-price">$${upsellItem.selectPrice || ''}</div>
                  </div>
                </div>
              `;
          });

          html += `
            </div> <!-- end xcart-main-section--container -->
          </div> <!-- end xcart-main-quantity-break -->
          `;
        });
      }

      html += `</div>`; // close #xcart-bundle-app

      row.innerHTML = html;
      lineList.appendChild(row);
    });

    subtotal.textContent = money(cart.items_subtotal_price || 0);
  }

  async function ensureFreshCart() {
    const cart = await fetchCart();
    await render(cart);
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

    // find the row for this line (for line/price spinner)
    const row = lineList.querySelector(
      `.xcart-line-wrapper[data-key="${CSS.escape(key)}"]`
    );
    if (row) row.classList.add('is-loading');

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
      await render(cart);
      return cart;
    } catch (e) {
      console.warn('change.js failed', e);
    } finally {
      busyMutation = false;
      if (row) row.classList.remove('is-loading');
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
  document.addEventListener('click', async (e) => {
    if (e.target instanceof Element) {
      if (e.target.closest('[data-xcart-close]') || e.target === overlay) {
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
        const key = rm.getAttribute('data-key');
        if (!key) return;

        // spinner on remove button
        rm.classList.add('is-loading');
        rm.disabled = true;

        try {
          await removeByKey(key);
        } finally {
          // button might already be removed after render, so check first
          if (document.body.contains(rm)) {
            rm.classList.remove('is-loading');
            rm.disabled = false;
          }
        }
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////

let selectedBundleId = null;

document.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;

  const el = e.target.closest('.xcart-main-quantity-break');
  if (!el) return;

  selectedBundleId = el.getAttribute('data-bundle-id');

  document
    .querySelectorAll('.xcart-main-quantity-break')
    .forEach((node) => {
      node.classList.toggle(
        'is-selected',
        node.getAttribute('data-bundle-id') === selectedBundleId
      );
    });
});