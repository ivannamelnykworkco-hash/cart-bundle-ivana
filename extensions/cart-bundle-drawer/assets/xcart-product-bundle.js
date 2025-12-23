/* ==========================================================
   cartdrawer-product-bundle.js
   Inject bundle UI on product page Buy Button
   ========================================================== */

(() => {
  const BUNDLE_ROOT_ID = 'xcart-product-bundle';

  let qbListArrayStore = [];
  let xyListArrayStore = [];
  let buListArrayStore = [];
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

    // submitBtn.parentNode.insertBefore(bundleRoot, submitBtn);

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
      const stListArray = product.stList || [];

      qbListArrayStore = qbListArray;
      xyListArrayStore = xyListArray;
      buListArrayStore = buListArray;


      renderBundles(bundleRoot, qbListArray, xyListArray, buListArray, gsListArray, stListArray);
    } catch (err) {
      console.error('[XCART] Bundle load error:', err);
    }
  }

  /* -----------------------------
     Render bundle options
  ------------------------------ */
  function renderBundles(bundleRoot, qbListArray, xyListArray, buListArray, gsListArray, stListArray) {
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
    //-------------font style =----------------------
    const fontWeightMap = {
      styleLight: '200',
      styleLightItalic: '200',
      styleRegular: '400',
      styleMedium: '400',
      styleMediumItalic: '400',
      styleBold: '700',
      styleBoldItalic: '700',
    };
    const fontStyleMap = {
      styleLight: 'normal',
      styleLightItalic: 'italic',
      styleRegular: 'normal',
      styleMedium: 'normal',
      styleMediumItalic: 'italic',
      styleBold: 'normal',
      styleBoldItalic: 'italic',
    };
    const barBlocktitleFontStyle = stListArray?.[0].barBlocktitleFontStyle;
    const bartitleFontStyle = stListArray?.[0].bartitleFontStyle;
    const labelFontStyle = stListArray?.[0].labelStyle;
    const subTitleFontStyle = stListArray?.[0].subTitleStyle;
    const upsellFontStyle = stListArray?.[0].upsellStyle;

    //-----------------------------------
    // NOTE: assumes `it` is defined somewhere in your theme/app
    if (selectedProductIds.includes(String(it.product_id))) {

      const headerWeight = fontWeightMap[barBlocktitleFontStyle] ?? '400';
      const headerStyle = fontStyleMap[barBlocktitleFontStyle] ?? 'normal';
      const bartitleFontWeight = fontWeightMap[bartitleFontStyle] ?? '700';
      const bartitleStyle = fontStyleMap[bartitleFontStyle] ?? 'normal';
      const labelWeight = fontWeightMap[labelFontStyle] ?? '400';
      const labelStyle = fontStyleMap[labelFontStyle] ?? 'normal';
      const subTitleWeight = fontWeightMap[subTitleFontStyle] ?? '400';
      const subTitleStyle = fontStyleMap[subTitleFontStyle] ?? 'nomal';
      const upsellWeight = fontWeightMap[upsellFontStyle] ?? '700';
      const upsellStyle = fontStyleMap[upsellFontStyle] ?? 'normal';


      html += `
        <div id="xcart-bundle-app">
          <div class="xcart-bundle-app--header" style='font-weight: ${headerWeight}; font-style: ${headerStyle}'><span>BUNDLE &amp; SAVE</span></div>
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
                        <span class="xcart-bundle-title" style='font-weight: ${bartitleFontWeight}; font-style: ${bartitleStyle}'>${bundleItem.title || ''}</span>
                        <span class="xcart-bundle-label" style='font-weight: ${labelWeight}; font-style: ${labelStyle}'>${bundleItem.label || ''}</span>
                      </div>
                      <div class="xcart-bundle-subtitle" style='font-weight: ${subTitleWeight}; font-style: ${subTitleStyle}'>${bundleItem.subtitle || ''}</div>
                    </div>
                  </div>
                  <div class="xcart--bundle-price">
                    <div class="xcart-bundle-discounted-price" style='font-weight: ${bartitleFontWeight}; font-style: ${bartitleStyle}'>$${(calc / 100).toFixed(2)}</div>
                    <div class="xcart-bundle-full-price">
                      <span>$${(base / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
        `;

        upsellArray.forEach((upsellItem) => {
          const imageUrl = upsellItem?.selectedProduct?.[0]?.imageUrl;
          console.log('upsellItem==>', upsellItem);
          html += `
              <div class="xcart-upsell-container">  
                <div class="xcart-upsell-checkbox-with-product--info">
                  <input 
                  type="checkbox"
                  class="xcart-upsell-checkbox"
                  data-variant-id="${upsellItem?.selectedProduct?.[1]?.id || ''}"
                  data-quantity="${upsellItem.quantity || 1}">
                  <div class="xcart-upsell-img" style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px">
                    <img style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px" src="${imageUrl || ''}" alt="${upsellItem.title || ''}" />
                  </div>
                  <div class="xcart-upsell-product-title" style='font-weight: ${upsellWeight}; font-style: ${upsellStyle}'>${upsellItem.priceText || ''}</div>
                </div>
                <div class="xcart-upsell-prices">
                  <div class="xcart-upsell-original-price" style='font-weight: ${upsellWeight}; font-style: ${upsellStyle}'>$${upsellItem.calc || ''}</div>
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
        console.log('upsellArray==>', upsellArray);
        const bQuantity = bundleItem.buyQuantity;
        const gQuantity = bundleItem.getQuantity;
        const tQuantity = bQuantity + gQuantity;
        const basePrice = it.price;
        const base = tQuantity * basePrice;
        const calc = bQuantity * basePrice;

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
                        <span class="xcart-bundle-title" style='font-weight: ${bartitleFontWeight}; font-style: ${bartitleStyle}'>${bundleItem.title || ''}</span>
                        <span class="xcart-bundle-label" style='font-weight: ${labelWeight}; font-style: ${labelStyle}'>${bundleItem.label || ''}</span>
                      </div>
                      <div class="xcart-bundle-subtitle" style='font-weight: ${subTitleWeight}; font-style: ${subTitleStyle}'>${bundleItem.subtitle || ''}</div>
                    </div>
                  </div>
                  <div class="xcart--bundle-price">
                    <div class="xcart-bundle-discounted-price" style='font-weight: ${bartitleFontWeight}; font-style: ${bartitleStyle}'>$${(calc / 100).toFixed(2)}</div>
                    <div class="xcart-bundle-full-price">
                      <span>$${(base / 100).toFixed(2)}</span>
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
                  <input
                  type="checkbox"
                  class="xcart-upsell-checkbox"
                  data-variant-id="${upsellItem?.selectedProduct?.[1]?.id || ''}"
                  data-quantity="${upsellItem.quantity || 1}">
                  <div class="xcart-upsell-img" style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px">
                    <img style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px" src="${imageUrl || ''}" alt="${upsellItem.title || ''}" />
                  </div>
                  <div class="xcart-upsell-product-title" style='font-weight: ${upsellWeight}; font-style: ${upsellStyle}'>${upsellItem.priceText || ''}</div>
                </div>
                <div class="xcart-upsell-prices">
                  <div class="xcart-upsell-original-price" style='font-weight: ${upsellWeight}; font-style: ${upsellStyle}'>$${upsellItem.calc || ''}</div>
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

      // ----- Bundle upsell -----
      buListArray.forEach((bundleItem) => {
        const upsellArray = Array.isArray(bundleItem.upsellItems)
          ? bundleItem.upsellItems
          : [];
        const productArray = Array.isArray(bundleItem.productItems)
          ? bundleItem.productItems
          : [];
        let totalBase = 0;
        let totalCalc = 0;
        productArray.forEach((productItem) => {
          const quantity = productItem.productQuantity || 1;
          const basePrice = productItem.selectedProduct?.[0]?.variants?.[0]?.node?.price || 0;
          const selectPrice = productItem.selectPrice || '';
          const discountPercent = productItem.discountPrice || 0;
          const discountPrice = productItem.discountPrice || 0;
          let calc = 0;
          let base = quantity * basePrice;
          console.log('basePrice==>', basePrice);

          if (selectPrice === 'discounted%') {
            calc = quantity * basePrice * (1 - discountPercent / 100); console.log('calc==>', calc);
          } else if (selectPrice === 'discounted$') {
            calc = quantity * basePrice - (quantity * discountPercent);
          } else if (selectPrice === 'specific') {
            calc = discountPrice || "0";
          } else {
            calc = quantity * basePrice;
          }

          totalBase += base;
          totalCalc += calc;
        });

        html += `
          <div class="xcart-main-quantity-break" data-bundle-id="${bundleItem.id}">
            <div class="xcart-main-quantity-break--container">
              <div class="xcart-bundle_bar_most_popular">
        `;

        if (bundleItem.badgeStyle === 'Simple' && bundleItem.badgeText) {
          html += `
                <div class="xcart-bundle_bar_most_popular_content" style='font-weight: ${upsellWeight}; font-style: ${upsellStyle}'>${bundleItem.badgeText}</div>
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
                        <span class="xcart-bundle-title" style='font-weight: ${bartitleFontWeight}; font-style: ${bartitleStyle}'>${bundleItem.title || ''}</span>
                        <span class="xcart-bundle-label" style='font-weight: ${labelWeight}; font-style: ${labelStyle}'>${bundleItem.label || ''}</span>
                      </div>
                      <div class="xcart-bundle-subtitle" style='font-weight: ${subTitleWeight}; font-style: ${subTitleStyle}'>${bundleItem.subtitle || ''}</div>
                    </div>
                  </div>
                  <div class="xcart--bundle-price">
                    <div class="xcart-bundle-discounted-price" style='font-weight: ${bartitleFontWeight}; font-style: ${bartitleStyle}'>$${(totalCalc.toFixed(2))}</div>
                    <div class="xcart-bundle-full-price">
                      <span>$${(totalBase.toFixed(2))}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="xcart-bundles__bundle-products">
        `;

        productArray.forEach((productItem) => {
          console.log('productItem==>', productItem);
          const quantity = productItem.productQuantity || 1;
          const basePrice = productItem.selectedProduct?.[0]?.variants?.[0]?.node?.price || 0;
          const selectPrice = productItem.selectPrice || '';
          const discountPercent = productItem.discountPrice || 0;
          const discountPrice = productItem.discountPrice || 0;
          let calc = 0;
          let base = quantity * basePrice;
          console.log('basePrice==>', basePrice);

          if (selectPrice === 'discounted%') {
            calc = quantity * basePrice * (1 - discountPercent / 100); console.log('calc==>', calc);
          } else if (selectPrice === 'discounted$') {
            calc = quantity * basePrice - (quantity * discountPercent);
          } else if (selectPrice === 'specific') {
            calc = discountPrice || "0";
          } else {
            calc = quantity * basePrice;
          }
          html += `
              <div class="xcart-bundles__bunlde-products--product">
                <div class="xcart-bundles__bundle-products__link">
                  <img alt="" class="xcart-bundles__bundle-products__image" height="50" width="50" src="${productItem?.selectedProduct?.[0]?.imageUrl || ''}">
                </div>
                <div class="xcart-bundles__bundle-products__link">
                  <div class="xcart-bundles__bundle-products__title">
                    <span>${productItem?.selectedProduct?.[0]?.title || ''}</span>
                  </div>
                </div>
                <div class="xcart-bundles__bundle-products__pricing">
                  <span class="xcart-bundles__bundle-products__price">$${(calc.toFixed(2))}</span>
                  <span class="xcart-bundles__bundle-products__full-price">$${(base.toFixed(2))}</span>
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
          const imageUrl = upsellItem?.selectedProduct?.[0]?.imageUrl;
          html += `
              <div class="xcart-upsell-container">
                <div class="xcart-upsell-checkbox-with-product--info">
                  <input
                  type="checkbox"
                  class="xcart-upsell-checkbox"
                  data-variant-id="${upsellItem?.selectedProduct?.[1]?.id || ''}"
                  data-quantity="${upsellItem.quantity || 1}">
                  <div class="xcart-upsell-img" style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px">
                    <img style="width: ${upsellItem?.imageSize || 40}px; height: ${upsellItem?.imageSize || 40}px" src="${imageUrl || ''}" alt="${upsellItem.title || ''}" />
                  </div>
                  <div class="xcart-upsell-product-title" style='font-weight: ${upsellWeight}; font-style: ${upsellStyle}'>${upsellItem.priceText || ''}</div>
                </div>
                <div class="xcart-upsell-prices">
                  <div class="xcart-upsell-original-price" style='font-weight: ${upsellWeight}; font-style: ${upsellStyle}'>$${upsellItem.calc || ''}</div>
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
        // 1) Only intercept when a bundle is actually selected
        const selectedEl = bundleRoot.querySelector('.xcart-main-quantity-break.is-selected');
        if (!selectedEl) {
          // No bundle selected – let Shopify's default form submit run
          return;
        }

        e.preventDefault();

        const selectedBundleItemId = selectedEl.dataset.bundleId;

        // 2) Get selected bundle info from stored arrays
        const qbBundle = qbListArrayStore.find(
          (item) => String(item.id) === String(selectedBundleItemId)
        );
        const xyBundle = xyListArrayStore.find(
          (item) => String(item.id) === String(selectedBundleItemId)
        );
        const buBundle = buListArrayStore.find(
          (item) => String(item.id) === String(selectedBundleItemId)
        );

        let quantity = 1;
        let bundleType = 'default';

        if (qbBundle) bundleType = 'qb';
        else if (xyBundle) bundleType = 'xy';
        else if (buBundle) bundleType = 'bu';

        switch (bundleType) {
          case 'qb':
            quantity = qbBundle.quantity || 1;
            break;
          case 'xy':
            quantity =
              (xyBundle.buyQuantity || 0) + (xyBundle.getQuantity || 0) || 1;
            break;
          case 'bu':
          default:
            quantity = 1;
            break;
        }

        // 3) Collect checked upsell items under this bundle
        const upsellCheckboxes = selectedEl.querySelectorAll(
          '.xcart-upsell-checkbox-with-product--info input[type="checkbox"]:checked'
        );

        const upsellItems = Array.from(upsellCheckboxes).map((checkbox) => {
          const rawId = checkbox.dataset.variantId; // GID or numeric
          const match = rawId?.match(/ProductVariant\/(\d+)/);
          const variantId = match ? match[1] : rawId; // use numeric if GID, else raw

          return {
            id: variantId,
            quantity: Number(checkbox.dataset.quantity || '1'),
          };
        });

        console.log('upsellItems ==>', upsellItems);

        // 4) Main product add-to-cart
        const formData = new FormData(form);
        formData.set('quantity', String(quantity));
        // Use the bundle item ID as the bundle identifier
        formData.append('properties[_xcart_bundle_id]', selectedBundleItemId);

        fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        })
          .then((res) => {
            if (!res.ok) {
              return res.text().then((msg) => {
                throw new Error(`[XCART] main add.js failed: ${msg}`);
              });
            }

            // 5) Add each checked upsell (but don't break everything if one fails)
            if (!upsellItems.length) return null;

            return Promise.allSettled(
              upsellItems
                .filter((item) => item.id)
                .map((item) => {
                  const upsellFormData = new FormData();
                  upsellFormData.append('id', item.id);
                  upsellFormData.append('quantity', String(item.quantity));
                  upsellFormData.append(
                    'properties[_xcart_bundle_parent_id]',
                    selectedBundleItemId
                  );

                  return fetch('/cart/add.js', {
                    method: 'POST',
                    body: upsellFormData,
                  }).then((r) => {
                    if (!r.ok) {
                      return r.text().then((msg) => {
                        console.warn('[XCART] upsell add.js failed:', msg);
                      });
                    }
                  });
                })
            );
          })
          .then(() => {
            // 6) Always notify theme/cart drawer, even if upsell calls partially fail
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
