export function safeJsonParse(obj: any) {
  if (Array.isArray(obj)) {
    return obj;
  }
  if (typeof obj !== "string")
    return obj;
  try {
    return JSON.parse(obj);
  } catch {
    return obj;
  }
}

export async function getAutomaticAppDiscount(admin: any, query: string, discountId: string) {
  if (!discountId)
    return null;
  try {
    const response = await admin.graphql(query, {
      variables: { id: discountId },
    });
    const body = await response.json();
    const node = body?.data?.automaticDiscountNode;
    if (!node) return null;
    // Ensure it's an App Discount
    if (node.automaticDiscount.__typename !== "DiscountAutomaticApp") {
      return null;
    }
    return node.id;
  } catch (err) {
    return err.message;
  }
}

export async function checkDuplicateDiscountName(admin: any, query: string, discountName: string): Promise<boolean> {
  const getDiscountVariables = {
    titleQuery: `title:${discountName}`,
  };
  try {
    const graphqlResult = await admin.graphql(query, { variables: getDiscountVariables });
    const body = await graphqlResult.json();

    const discounts = body?.data?.discountNodes?.edges
      ?.map(edge => edge.node.discount)
      ?.filter(d => d && d.__typename === "DiscountAutomaticApp" && d.title === discountName) || [];
    return discounts.length > 0;
  } catch (err: any) {
    return false;
  }
}

export async function createDiscountAutomaticApp(admin: any, query: string, variables: any) {
  try {
    const graphqlResult = await admin.graphql(query, { variables: variables });
    const body = await graphqlResult.json();
    const userErrors = body.data?.discountAutomaticAppCreate?.userErrors || [];
    if (userErrors.length > 0) {
      return null;
    }
    const automaticAppDiscount = body?.data?.discountAutomaticAppCreate?.automaticAppDiscount ?? null;
    return automaticAppDiscount;
  } catch (err: any) {
    // Network or other exceptions
    return null;
  }
}

export async function updateDiscountAutomaticApp(admin: any, query: string, discountId: string, discountData: any) {
  const updateVariables = {
    id: discountId,
    automaticAppDiscount: {
      title: discountData.discountName,
      startsAt: discountData.startsAt,
      endsAt: discountData.endsAt === "" ? null : discountData.endsAt,
    }
  };
  try {
    const graphqlResult = await admin.graphql(query, { variables: updateVariables });
    const body = await graphqlResult.json();
    const userErrors = body.data?.discountAutomaticAppUpdate?.userErrors || [];
    if (body.errors?.length) {
      return "body error";
    }
    if (userErrors.length > 0) {
      return "usererror";
    }
    const automaticAppDiscount = body?.data?.discountAutomaticAppUpdate?.automaticAppDiscount ?? null;
    if (automaticAppDiscount == null)
      return body.errors[0].message;
    if (!automaticAppDiscount) {
      return "Unknown error: discountAutomaticAppUpdate returned null";
    }
    return automaticAppDiscount;
  } catch (err: any) {
    // Network or other exceptions
    // return err.message;
    return "othererror";
  }
}

export async function addMetafield(admin: any, query: string, variables: any) {
  try {
    const response = await admin.graphql(query, { variables: variables });
    const json = await response.json?.() || response;
    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }
    const userErrors = json.data?.metafieldsSet?.userErrors;
    if (userErrors?.length) {
      throw new Error(userErrors[0].message);
    }
    return json.data.metafieldsSet.metafields;
  } catch (err) {
    // throw new Error(`Failed to set metafields: ${err.message}`);
    throw new Error(`Failed to set metafields: ${variables.ownerId}`);
  }
}

export function makeAddMetafieldVariables(
  generalSetting: any,
  quantityBreak: any,
  buyXGetY: any,
  bundleUpsell: any
) {
  const discountId = generalSetting.discountId;
  let productList;
  let collectionList;
  // Apply discount to specific products(4 types - all, except, specific, collection)
  const productScope = generalSetting.visibility;

  switch (productScope) {
    case "specific":
      productList = generalSetting.selectedProductData;
      break;
    case "collections":
      collectionList = generalSetting.selectedCollectionData;
      break;
    case "except":
      collectionList = generalSetting?.excludedCollectionData ?? [];
      productList = generalSetting?.excludedProductData ?? [];
      break;
    default:
      productList = [];
      collectionList = [];
  }
  productList = safeJsonParse(productList);
  collectionList = safeJsonParse(collectionList);
  // Set discount configuration
  // discountConf type: quantity_break, buyx_gety, bundle_upsell
  // discout Type: default, percent, fixed_amount, total_price
  const discountConf: any[] = [];
  const priceTypeMap = {
    "discounted%": "percent",
    "discounted$": "fixed_amount",
    "specific": "total_price"
  };
  quantityBreak.forEach(record => {
    discountConf.push({
      type: "quantity_break",
      quantity: record.quantity,
      discountType: priceTypeMap[record.selectPrice] || "default",
      discountPricePerItem: record.discountPrice,
      upsellItems: (record.upsellItems || []).map(item => ({
        id: item.selectedProduct?.[0].id ?? null,
        quantity: item.quantity,
        discountType: priceTypeMap[item.selectPrice] || "default",
        discountPricePerItem: item.discountPrice
      }))
    });
  });

  buyXGetY.forEach(record => {
    discountConf.push({
      type: "buyx_gety",
      buyQuantity: record.buyQuantity,
      getQuantity: record.getQuantity,
      upsellItems: (record.upsellItems || []).map(item => ({
        id: item.selectedProduct?.[0]?.id ?? null,
        quantity: item.quantity,
        discountType: priceTypeMap[item.selectPrice] || "default",
        discountPricePerItem: item.discountPrice
      }))
    });
  });

  bundleUpsell.forEach(record => {
    const defaultVariant = record.defaultVariant;
    // Make sure variants exist
    discountConf.push({
      type: "bundle_upsell",
      defaultProduct: {
        id: defaultVariant?.variants?.[0]?.node?.id ?? defaultVariant?.id,
        quantity: record.quantity,
        discountType: priceTypeMap[record.selectPrice] || "default",
        discountPricePerItem: record.discountPrice
      },
      addedProducts: (record.productItems || []).map(product => ({
        id: product.selectedProduct?.[0].id ?? null,
        quantity: product.quantity,
        discountType: priceTypeMap[product.selectPrice] || "default",
        discountPricePerItem: product.discountPrice
      })),
      upsellItems: (record.upsellItems || []).map(item => ({
        id: item.selectedProduct?.[0].id ?? null,
        quantity: item.quantity,
        discountType: priceTypeMap[item.selectPrice] || "default",
        discountPricePerItem: item.discountPrice
      }))
    });
  });

  // add metafields of product info
  const addMetafieldVariables = {
    metafields: [
      {
        ownerId: discountId,
        namespace: "$app:discountInfo",
        key: "productInfo",
        type: "json",
        value: JSON.stringify({
          productScope: productScope,
          productList: productList,
          selectedCollectionIds: collectionList,
          discountConf: discountConf
        })
      }
    ]
  };
  return addMetafieldVariables;
}