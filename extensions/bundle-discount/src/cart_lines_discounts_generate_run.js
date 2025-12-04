import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
} from '../generated/api';


/**
  * @typedef {import("../generated/api").CartInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  const { cart } = input;

  if (!cart.lines.length) {
    throw new Error("No cart lines found");
  }

  const discountOperations = [];

  // Loop through each cart line and check variant quantity
  for (const line of cart.lines) {
    const variantId = line.merchandise.id;
    const variantTitle = line.merchandise.title;
    const quantity = line.quantity;

    let discountPercent = 0;
    if (quantity === 2) {
      discountPercent = 10;
    } else if (quantity >= 3) {
      discountPercent = 50;
    }

    if (discountPercent > 0) {
      discountOperations.push({
        productDiscountsAdd: {
          candidates: [
            {
              message: `${discountPercent}% off for buying ${quantity}x ${variantTitle}`,
              targets: [
                {
                  cartLine: {
                    id: line.id,
                  },
                },
              ],
              value: {
                percentage: {
                  value: discountPercent,
                },
              },
            },
          ],
          selectionStrategy: ProductDiscountSelectionStrategy.All,
        },
      });
    }
  }

  return {
    operations: discountOperations,
  };
}