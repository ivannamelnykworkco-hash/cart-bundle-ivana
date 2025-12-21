import db from "../db.server";
export async function getBundleUpsells(bundleId) {
  return db.bundleUpsell.findMany({
    where: {
      bundleId: bundleId
    },
    include: {
      upsellItems: true,
      productItems: true
    },
    orderBy: {
      updatedAt: "desc" // optional, order by updatedAt
    }
  });
}

export async function updateBundleUpsell(data) {
  const bundleUpsellData: any = {
    id: data.id || null,
    bundleId: data.bundleId || "",
    isOpen: data.isOpen === "true",
    layoutOption: data.layoutOption,
    title: data.title || "",
    subtitle: data.subtitle || "",
    badgeText: data.badgeText || "",
    badgeStyle: data.badgeStyle || "",
    labelText: data.labelText || "",
    defaultVariant: data.defaultVariant || "",
    isSelectedByDefault: data.isSelectedByDefault === "true",
    isShowQuantitySelector: data.isShowQuantitySelector === "true",
    productCounts: data.productCounts ? parseInt(data.productCounts, 10) : 1,
    selectPrice: data.selectPrice || "",
    discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : 0,
    isShowAsSoldOut: data.isShowAsSoldOut === "true",
    labelTitle: data.labelTitle || "",
    opacity: data.opacity ? parseInt(data.opacity, 10) : 1,
    bgColor: data.bgColor || "",
    textColor: data.textColor || "",
    labelSize: data.labelSize ? parseInt(data.labelSize, 10) : 12,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (data.productItems) {
    try {
      bundleUpsellData.productItems = data.productItems.map((u: any) => ({
        id: u.id || null,
        buId: u.buId || null,
        quantity: parseInt(u.quantity, 10) || 1,
        selectPrice: u.selectPrice || "",
        discountPrice: u.discountPrice ? parseFloat(u.discountPrice) : 0,
        selectedVariants: u.selectedVariants || "",
        selectedProduct: u.selectedProduct || "",
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      bundleUpsellData.productItems = [];
    }
  } else {
    bundleUpsellData.productItems = [];
  }

  if (data.upsellItems) {
    try {
      bundleUpsellData.upsellItems = data.upsellItems.map((u: any) => ({
        id: u.id || null,
        qbId: u.qbId || null,
        bxGyId: u.bxGyId || null,
        buId: u.buId || null,
        isSelectedProduct: u.isSelectedProduct || "",
        selectedVariants: u.selectedVariants || "",
        selectedProduct: u.selectedProduct || "",
        selectPrice: u.selectPrice || "",
        base: u.base || 10,
        calc: u.calc || 20,
        quantity: parseInt(u.quantity, 10) || 1,
        discountPrice: u.discountPrice ? parseFloat(u.discountPrice) : 0,
        priceText: u.priceText || "",
        isSelectedByDefault: u.isSelectedByDefault === true || u.isSelectedByDefault === "true",
        imageSize: parseInt(u.imageSize, 10) || 12,
        isVisibleOnly: u.isVisibleOnly === true || u.isVisibleOnly === "true",
        isShowAsSoldOut: u.isShowAsSoldOut === true || u.isShowAsSoldOut === "true",
        labelTitle: u.labelTitle || "",
        opacity: u.opacity ? parseInt(u.opacity, 10) : 1,
        bgColor: u.bgColor || "",
        textColor: u.textColor || "",
        labelSize: u.labelSize ? parseInt(u.labelSize, 10) : 12,
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      bundleUpsellData.upsellItems = [];
    }
  } else {
    bundleUpsellData.upsellItems = [];
  }

  // Deleted upsells
  if (data.upsellItemsToDeleteIds) {
    try {
      bundleUpsellData.upsellItemsToDeleteIds = JSON.parse(data.upsellItemsToDeleteIds);
    } catch {
      bundleUpsellData.upsellItemsToDeleteIds = [];
    }
  } else {
    bundleUpsellData.upsellItemsToDeleteIds = [];
  }

  // Deleted productItems
  if (data.productItemsToDeleteIds) {
    try {
      bundleUpsellData.productItemsToDeleteIds = JSON.parse(data.productItemsToDeleteIds);
    } catch {
      bundleUpsellData.productItemsToDeleteIds = [];
    }
  } else {
    bundleUpsellData.productItemsToDeleteIds = [];
  }

  // UPSERT BundleUpsell
  const bundleUpsell = await db.bundleUpsell.upsert({
    where: { id: bundleUpsellData.id ?? crypto.randomUUID() },
    update: {
      bundleId: bundleUpsellData.bundleId,
      isOpen: bundleUpsellData.isOpen,
      layoutOption: bundleUpsellData.layoutOption,
      title: bundleUpsellData.title,
      subtitle: bundleUpsellData.subtitle,
      badgeText: bundleUpsellData.badgeText,
      badgeStyle: bundleUpsellData.badgeStyle,
      labelText: bundleUpsellData.labelText,
      defaultVariant: bundleUpsellData.defaultVariant,
      isSelectedByDefault: bundleUpsellData.isSelectedByDefault,
      isShowQuantitySelector: bundleUpsellData.isShowQuantitySelector,
      productCounts: bundleUpsellData.productCounts,
      selectPrice: bundleUpsellData.selectPrice,
      discountPrice: bundleUpsellData.discountPrice,
      isShowAsSoldOut: bundleUpsellData.isShowAsSoldOut,
      labelTitle: bundleUpsellData.labelTitle,
      opacity: bundleUpsellData.opacity,
      bgColor: bundleUpsellData.bgColor,
      textColor: bundleUpsellData.textColor,
      labelSize: bundleUpsellData.labelSize,
      updatedAt: new Date().toISOString()
    },
    create: {
      bundleId: bundleUpsellData.bundleId,
      isOpen: bundleUpsellData.isOpen,
      layoutOption: bundleUpsellData.layoutOption,
      title: bundleUpsellData.title,
      subtitle: bundleUpsellData.subtitle,
      badgeText: bundleUpsellData.badgeText,
      badgeStyle: bundleUpsellData.badgeStyle,
      labelText: bundleUpsellData.labelText,
      defaultVariant: bundleUpsellData.defaultVariant,
      isSelectedByDefault: bundleUpsellData.isSelectedByDefault,
      isShowQuantitySelector: bundleUpsellData.isShowQuantitySelector,
      productCounts: bundleUpsellData.productCounts,
      selectPrice: bundleUpsellData.selectPrice,
      discountPrice: bundleUpsellData.discountPrice,
      isShowAsSoldOut: bundleUpsellData.isShowAsSoldOut,
      labelTitle: bundleUpsellData.labelTitle,
      opacity: bundleUpsellData.opacity,
      bgColor: bundleUpsellData.bgColor,
      textColor: bundleUpsellData.textColor,
      labelSize: bundleUpsellData.labelSize,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  // DELETE upsellItems removed from frontend
  if (bundleUpsellData.upsellItemsToDeleteIds.length > 0) {
    await db.bundleUpsellItem.deleteMany({
      where: { id: { in: bundleUpsellData.upsellItemsToDeleteIds } }
    });
  }
  // DELETE productItems from frontend 
  if (bundleUpsellData.productItemsToDeleteIds.length > 0) {
    await db.productItem.deleteMany({
      where: { id: { in: bundleUpsellData.productItemsToDeleteIds } }
    });
  }

  // Upsert each ProductItem
  // delete useless data
  const incomingProductIds = bundleUpsellData.productItems
    .map(u => u.id)
    .filter(Boolean);
  await db.productItem.deleteMany({
    where: {
      buId: bundleUpsell.id,
      id: { notIn: incomingProductIds },
    },
  });

  for (const u of bundleUpsellData.productItems) {
    await db.productItem.upsert({
      where: { id: u.id ?? crypto.randomUUID() },
      update: {
        buId: bundleUpsell.id,
        quantity: u.quantity,
        selectPrice: u.selectPrice,
        discountPrice: u.discountPrice,
        selectedVariants: u.selectedVariants,
        selectedProduct: u.selectedProduct,
        updatedAt: new Date().toISOString()
      },
      create: {
        buId: bundleUpsell.id,
        quantity: u.quantity,
        selectPrice: u.selectPrice,
        discountPrice: u.discountPrice,
        selectedVariants: u.selectedVariants,
        selectedProduct: u.selectedProduct,
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }
  // UPSERT each upsell
  // delete useless data
  const incomingUpsellIds = bundleUpsellData.upsellItems
    .map(u => u.id)
    .filter(Boolean);

  await db.bundleUpsellItem.deleteMany({
    where: {
      buId: bundleUpsell.id,
      id: { notIn: incomingUpsellIds },
    },
  });

  for (const u of bundleUpsellData.upsellItems) {

    await db.bundleUpsellItem.upsert({
      where: { id: u.id ?? crypto.randomUUID() },
      update: {
        isSelectedProduct: u.isSelectedProduct,
        selectedVariants: u.selectedVariants,
        selectedProduct: u.selectedProduct,
        selectPrice: u.selectPrice,
        base: u.base || 10,
        calc: u.calc || 20,
        quantity: u.quantity,
        discountPrice: u.discountPrice,
        priceText: u.priceText,
        isSelectedByDefault: u.isSelectedByDefault,
        imageSize: u.imageSize,
        isVisibleOnly: u.isVisibleOnly,
        isShowAsSoldOut: u.isShowAsSoldOut,
        labelTitle: u.labelTitle,
        opacity: u.opacity,
        bgColor: u.bgColor,
        textColor: u.textColor,
        labelSize: u.labelSize,
        bundleUpsell: {
          connect: { id: bundleUpsell.id }
        },
        updatedAt: new Date().toISOString()
      },
      create: {
        isSelectedProduct: u.isSelectedProduct,
        selectedVariants: u.selectedVariants,
        selectedProduct: u.selectedProduct,
        selectPrice: u.selectPrice,
        base: u.base || 10,
        calc: u.calc || 20,
        quantity: u.quantity,
        discountPrice: u.discountPrice,
        priceText: u.priceText,
        isSelectedByDefault: u.isSelectedByDefault,
        imageSize: u.imageSize,
        isVisibleOnly: u.isVisibleOnly,
        isShowAsSoldOut: u.isShowAsSoldOut,
        labelTitle: u.labelTitle,
        opacity: u.opacity,
        bgColor: u.bgColor,
        textColor: u.textColor,
        labelSize: u.labelSize,
        bundleUpsell: {
          connect: { id: bundleUpsell.id }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }
  return bundleUpsell;
}

export async function updateBundleUpsells(bundleUpsellList) {
  const newIds = bundleUpsellList.map(r => r.id);
  await db.bundleUpsell.deleteMany({
    where: {
      id: { notIn: newIds }
    }
  });
  return Promise.all(bundleUpsellList.map(bundleUpsell => updateBundleUpsell(bundleUpsell)));
}

export async function deleteBundleUpsells(params: { id?: string, bundleId?: string }) {
  const { id, bundleId } = params;
  if (!id && !bundleId) {
    throw new Error("Must provide id or bundleId");
  }
  await db.bundleUpsell.deleteMany({
    where: {
      OR: [
        id ? { id } : undefined,
        bundleId ? { bundleId } : undefined,
      ].filter(Boolean) as any[],
    },
  });
}
