import {
  ProductDiscountSelectionStrategy,
} from "../generated/api";

/**
 * @typedef {import("../generated/api").CartInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */

function parseMetafield(metafield) {
  ////////////////////
  try {
    const value = JSON.parse(metafield.value);
    return {
      allowedProductIds: value.productList || [],
      selectedCollectionIds: value.selectedCollectionIds || [],
      productScope: value.productScope || "",
    };
    ////////////////////
  } catch (error) {
    console.error("Error parsing metafield", error);
    return {
      allowedProductIds: [],
      selectedCollectionIds: [],
      productScope: "",
    };
  }
}

export function cartLinesDiscountsGenerateRun(input) {
  const { cart, discount } = input;
  if (!cart.lines.length) {
    return { operations: [] };
  }

  const { allowedProductIds, selectedCollectionIds, productScope } = parseMetafield(discount.metafield);


  const candidates = [];

  for (const line of cart.lines) {
    const productId = line.merchandise.product.id;
    const variantTitle = line.merchandise.title;
    const quantity = line.quantity;
    // const views = line.merchandise.product.inAnyCollection;
    let ids = line.merchandise.product.inAnyCollection;

    console.log("ids==>", ids);

    if (productScope === "specific" && !allowedProductIds.includes(productId))
      continue;
    if (productScope === "except" && allowedProductIds.includes(productId))
      continue;
    if (productScope === "collections" && !line.merchandise.product.inAnyCollection)
      continue;
    if (productScope === "except" && line.merchandise.product.inAnyCollection)
      continue;
    let discountPercent = 0;

    if (quantity === 2)
      discountPercent = 10;
    else if (quantity >= 3)
      discountPercent = 50;

    if (discountPercent === 0) continue;

    candidates.push({
      message: `${discountPercent}% off for buying ${quantity} × ${variantTitle}`,
      targets: [
        {
          cartLine: { id: line.id },
        },
      ],
      value: {
        percentage: {
          value: discountPercent.toString(),
        },
      },
    });
  }

  if (candidates.length === 0) {
    return { operations: [] };
  }

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