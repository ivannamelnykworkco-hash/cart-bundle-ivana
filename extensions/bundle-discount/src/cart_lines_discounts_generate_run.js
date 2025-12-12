import { ProductDiscountSelectionStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").CartInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

function parseMetafield(metafield) {
  try {
    const value = JSON.parse(metafield.value);
    return {
      allowedProductIds: value.productList || [],
      selectedCollectionIds: value.selectedCollectionIds || [],
      productScope: value.productScope || "",
      discountConf: value.discountConf || []
    };
  } catch (error) {
    console.error("Error parsing metafield", error);
    return {
      allowedProductIds: [],
      selectedCollectionIds: [],
      productScope: "",
      discountConf: []
    };
  }
}

export function cartLinesDiscountsGenerateRun(input) {
  const { cart, discount } = input;
  if (!cart.lines.length) return { operations: [] };

  const { allowedProductIds, selectedCollectionIds, productScope, discountConf } =
    parseMetafield(discount.metafield);

  const candidates = [];

  for (const line of cart.lines) {
    const productId = line.merchandise.product.id;
    const variantTitle = line.merchandise.title;
    const quantity = line.quantity;
    const lineTotal = parseFloat(line.cost.subtotalAmount.amount);

    // --------- Product scope filtering ---------
    if (productScope === "specific" && !allowedProductIds.includes(productId)) continue;
    if (productScope === "except" && allowedProductIds.includes(productId)) continue;
    if (productScope === "collections" && !line.merchandise.product.inAnyCollection) continue;
    if (productScope === "except" && line.merchandise.product.inAnyCollection) continue;

    // --------- Process discount candidates ---------
    for (const conf of discountConf) {
      // ---------------- Quantity Break ----------------
      if (conf.type === "quantity_break" && quantity >= conf.quantity) {
        let value = {};
        switch (conf.discountType) {
          case "percent":
            value = { percentage: { value: conf.discountPricePerItem.toString() } };
            break;
          case "fixed_amount":
            value = { fixedAmount: { amount: conf.discountPricePerItem.toString(), appliesToEachItem: true } };
            break;
          case "total_price":
            const discountAmount = lineTotal - conf.discountPricePerItem;
            if (discountAmount > 0) {
              value = { fixedAmount: { amount: discountAmount.toString(), appliesToEachItem: false } };
            } else continue;
            break;
          case "default":
          default:
            continue;
        }

        candidates.push({
          message: `Quantity break: ${conf.discountPricePerItem}${conf.discountType === "percent" ? "%" : ""} off ${quantity} × ${variantTitle}`,
          targets: [{ cartLine: { id: line.id } }],
          value
        });
      }

      // ---------------- Buy X Get Y ----------------
      if (conf.type === "buyx_gety" && quantity >= conf.buyQuantity) {
        const freeItems = Math.floor(quantity / conf.buyQuantity) * conf.getQuantity;
        if (freeItems > 0) {
          const pricePerItem = lineTotal / quantity;
          const discountAmount = freeItems * pricePerItem;

          candidates.push({
            message: `Buy ${conf.buyQuantity} get ${conf.getQuantity}: free ${freeItems} × ${variantTitle}`,
            targets: [{ cartLine: { id: line.id } }],
            value: { fixedAmount: { amount: discountAmount.toString(), appliesToEachItem: false } }
          });
        }
      }

      // ---------------- Bundle Upsell ----------------
      if (conf.type === "bundle_upsell") {
        // Default product
        if (productId === conf.defaultProduct.id && quantity >= conf.defaultProduct.quantity) {
          let value = {};
          switch (conf.defaultProduct.discountType) {
            case "percent":
              value = { percentage: { value: conf.defaultProduct.discountPricePerItem.toString() } };
              break;
            case "fixed_amount":
              value = { fixedAmount: { amount: conf.defaultProduct.discountPricePerItem.toString(), appliesToEachItem: true } };
              break;
            case "total_price":
              const discountAmount = lineTotal - conf.defaultProduct.discountPricePerItem;
              if (discountAmount > 0) {
                value = { fixedAmount: { amount: discountAmount.toString(), appliesToEachItem: false } };
              } else continue;
              break;
            case "default":
            default:
              continue;
          }
          candidates.push({
            message: `Bundle upsell: ${conf.defaultProduct.discountPricePerItem}${conf.defaultProduct.discountType === "percent" ? "%" : ""} off ${variantTitle}`,
            targets: [{ cartLine: { id: line.id } }],
            value
          });
          // Added products
          for (const added of conf.addedProducts || []) {
            const addedLine = cart.lines.find(l => l.merchandise.product.id === added.id);
            if (!addedLine)
              continue;
            if (addedLine.quantity < added.quantity)
              continue;
            const addedLineTotal = parseFloat(addedLine.cost.subtotalAmount.amount);
            let addedValue = {};
            switch (added.discountType) {
              case "percent":
                addedValue = { percentage: { value: added.discountPricePerItem.toString() } };
                break;
              case "fixed_amount":
                addedValue = { fixedAmount: { amount: added.discountPricePerItem.toString(), appliesToEachItem: true } };
                break;
              case "total_price":
                const addedDiscount = addedLineTotal - added.discountPricePerItem;
                if (addedDiscount > 0) {
                  addedValue = { fixedAmount: { amount: addedDiscount.toString(), appliesToEachItem: false } };
                } else continue;
                break;
              case "default":
              default:
                continue;
            }
            candidates.push({
              message: `Bundle upsell added product: ${added.discountPricePerItem}${added.discountType === "percent" ? "%" : ""} off ${addedLine.merchandise.title}`,
              targets: [{ cartLine: { id: addedLine.id } }],
              value: addedValue
            });
          }
        }
      }
    }
  }

  if (candidates.length === 0) return { operations: [] };

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates,
          selectionStrategy: ProductDiscountSelectionStrategy.All,
        },
      },
    ],
  };

}