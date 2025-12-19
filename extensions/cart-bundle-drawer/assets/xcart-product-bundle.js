/* ==========================================================
   cartdrawer-product-bundle.js
   Inject bundle UI on product page Buy Button
   ========================================================== */

(() => {
  const BUNDLE_ROOT_ID = 'xcart-product-bundle';



  function init() {
    const bundleRoot = document.getElementById(BUNDLE_ROOT_ID);
    if (!bundleRoot) return;

    const form = document
      .querySelector('product-form')
      ?.querySelector('form[action*="/cart/add"]');

    if (!form) return;

    injectBundleUI(bundleRoot, form);
    bindFormSubmit(bundleRoot, form);
    watchVariantChanges(bundleRoot, form);
  }

  /* -----------------------------
     Inject UI before Buy Button
  ------------------------------ */
  function injectBundleUI(bundleRoot, form) {
    const submitBtn =
      form.querySelector('[type="submit"]') ||
      form.querySelector('button[name="add"]');

    if (!submitBtn) return;

    if (bundleRoot.__injected) return;
    bundleRoot.__injected = true;

    bundleRoot.innerHTML = `
      <div class="xcart-bundle-app">
        <div class="xcart-bundle-list" role="list"></div>
      </div>
    `;

    submitBtn.parentNode.insertBefore(bundleRoot, submitBtn);

    loadBundles(bundleRoot);
  }

  /* -----------------------------
     Load bundles from app proxy
  ------------------------------ */
  async function loadBundles(bundleRoot) {
    try {
      const res = await fetch('/apps/cart-drawer-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Bundle fetch failed');

      const data = await res.json();
      const product = data?.[0];
      if (!product) return;

      const qbListArray = product.qbList || [];
      const xyListArray = product.xyList || [];
      const buListArray = product.buList || [];
      const gsListArray = product.gsList || [];

      console.log('gsLintArray==>', gsListArray);

      renderBundles(bundleRoot, qbListArray, xyListArray, buListArray, gsListArray);
    } catch (err) {
      console.error('[XCART] Bundle load error:', err);
    }
  }

  /* -----------------------------
     Render bundle options
  ------------------------------ */
  function renderBundles(bundleRoot, qbListArray, xyListArray, buListArray, gsListArray) {
    const list = bundleRoot.querySelector('.xcart-bundle-list');
    if (!list) return;

    list.innerHTML = '';
    ////////---------product information---------------
    function getCurrentProduct() {
      const el = document.getElementById('xcart-product-json');
      if (!el) return null;

      try {
        return JSON.parse(el.textContent || el.innerText || '{}');
      } catch (e) {
        console.error('[XCART] Failed to parse product JSON', e);
        return null;
      }
    }

    const productJson = getCurrentProduct();
    const it = productJson
      ? {
        product_id: productJson.id,
        price: productJson.price,              // in cents
        compare_at_price: productJson.compare_at_price, // may be null
      }
      : null;
    console.log('it==>', it)
    ///////////////////////////////////////////-----------------------
    // selected product id (safe)
    const selected = gsListArray?.[0]?.selectedProducts
      ? gsListArray[0].selectedProducts.split(',').map((id) => id.trim())
      : [];

    const selectedProductIds = selected
      .map((gid) => {
        const match = gid.match(/\/Product\/(\d+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    let html = '';

    // NOTE: assumes `it` is defined somewhere in your theme/app
    console.log('selectedProductids==>', selectedProductIds, it.product_id)
    if (selectedProductIds.includes(String(it.product_id))) {
      html += `
        <div id="xcart-bundle-app">
          <div class="xcart-bundle-app--header"><span>BUNDLE &amp; SAVE</span></div>
      `;

      // ----- QB bundles -----
      console.log(qbListArray)
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
                    <div class="xcart-bundle-discounted-price">${(calc)}</div>
                    <div class="xcart-bundle-full-price">
                      <span>${(base)}</span>
                    </div>
                  </div>
                </div>
              </div>
        `;

        upsellArray.forEach((upsellItem) => {
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
                  <div class="xcart-upsell-original-price">$${upsellItem.calc || ''}</div>
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
                    <div class="xcart-bundle-discounted-price"></div>
                    <div class="xcart-bundle-full-price">
                      <span>${(Number.isFinite(it.final_line_price) ? it.final_line_price : it.line_price)}</span>
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
                    <div class="xcart-bundle-discounted-price"></div>
                    <div class="xcart-bundle-full-price">
                      <span>${(Number.isFinite(it.final_line_price) ? it.final_line_price : it.line_price)}</span>
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
                <div class="xcart-bundles__bundle-products__divider-icon">
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="currentColor"></circle>
                    <path fill="#fff" d="M5 9h10v2H5z"></path>
                    <path fill="#fff" d="M11 5v10H9V5z"></path>
                  </svg>
                </div>
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

      html += `
        </div> <!-- end #xcart-bundle-app -->
      `;
    }

    // finally inject the built HTML
    list.innerHTML = html;
  }

  /* -----------------------------
     Bundle selection
  ------------------------------ */
  function selectBundle(bundleRoot, bundleId) {
    bundleRoot.dataset.selectedBundleId = bundleId;

    bundleRoot
      .querySelectorAll('.xcart-bundle-option')
      .forEach((el) => {
        el.classList.toggle(
          'is-selected',
          el.getAttribute('data-bundle-id') === bundleId
        );
      });
  }

  /* -----------------------------
     Attach bundle data on submit
  ------------------------------ */
  function bindFormSubmit(bundleRoot, form) {
    form.addEventListener(
      'submit',
      (e) => {
        const selectedBundleId = bundleRoot.dataset.selectedBundleId;
        if (!selectedBundleId) return;

        e.preventDefault();

        const formData = new FormData(form);
        formData.append('properties[_xcart_bundle_id]', selectedBundleId);

        fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        })
          .then(() => {
            document.dispatchEvent(
              new CustomEvent('cart:added', { bubbles: true })
            );
          })
          .catch((err) => {
            console.error('[XCART] add.js error', err);
          });
      },
      true
    );
  }

  /* -----------------------------
     Variant sync
  ------------------------------ */
  function watchVariantChanges(bundleRoot, form) {
    const variantInput = form.querySelector('[name="id"]');
    if (!variantInput) return;

    let lastVariant = variantInput.value;

    const observer = new MutationObserver(() => {
      if (variantInput.value !== lastVariant) {
        lastVariant = variantInput.value;
        bundleRoot.dataset.variantId = lastVariant;
      }
    });

    observer.observe(variantInput, {
      attributes: true,
      attributeFilter: ['value'],
    });
  }

  /* -----------------------------
     Bootstrap
  ------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

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
