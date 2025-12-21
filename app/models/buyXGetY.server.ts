import db from "../db.server";

export async function getBuyXGetYs(bundleId: string) {
  return db.buyXGetY.findMany({
    where: {
      bundleId: bundleId
    },
    include: {
      upsellItems: true
    },
    orderBy: {
      updatedAt: "desc" // optional, order by updatedAt
    }
  });
}

export async function updateBuyXGetY(data) {
  // prepare data for update
  const buyXGetYData: any = {
    id: data.id || null,
    bundleId: data.bundleId || "",
    isOpen: data.isOpen === "true",
    buyQuantity: data.buyQuantity ? parseInt(data.buyQuantity, 10) : 0,
    getQuantity: data.getQuantity ? parseInt(data.getQuantity, 10) : 0,
    title: data.title || "",
    subtitle: data.subtitle || "",
    badgeText: data.badgeText || "",
    badgeStyle: data.badgeStyle || "",
    labelText: data.labelText || "",
    isSelectedByDefault: data.isSelectedByDefault === "true",
    isShowAsSoldOut: data.isShowAsSoldOut === "true",
    labelTitle: data.labelTitle || "",
    opacity: data.opacity ? parseInt(data.opacity, 10) : 1,
    bgColor: data.bgColor || "",
    textColor: data.textColor || "",
    labelSize: data.labelSize ? parseInt(data.labelSize, 10) : 12,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (data.upsellItems) {
    try {
      buyXGetYData.upsellItems = data.upsellItems.map((u: any) => ({
        id: u.id || null,
        qbId: u.qbId || null,
        bxGyId: u.bxGyId || null,
        buId: u.buId || null,
        isSelectedProduct: u.isSelectedProduct || "",
        selectedVariants: u.selectedVariants || "",
        selectedProduct: u.selectedProduct || "",
        quantity: parseInt(u.quantity, 10) || 1,
        base: u.base || 10,
        calc: u.calc || 20,
        selectPrice: u.selectPrice || "",
        discountPrice: u.discountPrice ? parseFloat(u.discountPrice) : null,
        priceText: u.priceText || "",
        isSelectedByDefault: u.isSelectedByDefault === true || u.isSelectedByDefault === "true",
        imageSize: u.imageSize || 20,
        isVisibleOnly: u.isVisibleOnly === true || u.isVisibleOnly === "true",
        isShowAsSoldOut: u.isShowAsSoldOut === true || u.isShowAsSoldOut === "true",
        labelTitle: u.labelTitle || "",
        opacity: u.opacity ? parseInt(u.opacity, 10) : 100,
        bgColor: u.bgColor || "",
        textColor: u.textColor || "",
        labelSize: u.labelSize ? parseInt(u.labelSize, 10) : 12,
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      buyXGetYData.upsellItems = [];
    }
  } else {
    buyXGetYData.upsellItems = [];
  }

  // Deleted upsells
  if (data.upsellItemsToDeleteIds) {
    try {
      buyXGetYData.upsellItemsToDeleteIds = JSON.parse(data.upsellItemsToDeleteIds);
    } catch {
      buyXGetYData.upsellItemsToDeleteIds = [];
    }
  } else {
    buyXGetYData.upsellItemsToDeleteIds = [];
  }

  // UPSERT BuyXGetY
  const buyXGetY = await db.buyXGetY.upsert({
    where: { id: buyXGetYData.id ?? crypto.randomUUID() },
    update: {
      bundleId: buyXGetYData.bundleId,
      isOpen: buyXGetYData.isOpen,
      buyQuantity: buyXGetYData.buyQuantity,
      getQuantity: buyXGetYData.getQuantity,
      title: buyXGetYData.title,
      subtitle: buyXGetYData.subtitle,
      badgeText: buyXGetYData.badgeText,
      badgeStyle: buyXGetYData.badgeStyle,
      labelText: buyXGetYData.labelText,
      isSelectedByDefault: buyXGetYData.isSelectedByDefault,
      isShowAsSoldOut: buyXGetYData.isShowAsSoldOut,
      labelTitle: buyXGetYData.labelTitle,
      opacity: buyXGetYData.opacity,
      bgColor: buyXGetYData.bgColor,
      textColor: buyXGetYData.textColor,
      labelSize: buyXGetYData.labelSize,
      updatedAt: new Date().toISOString()
    },
    create: {
      bundleId: buyXGetYData.bundleId,
      isOpen: buyXGetYData.isOpen,
      buyQuantity: buyXGetYData.buyQuantity,
      getQuantity: buyXGetYData.getQuantity,
      title: buyXGetYData.title,
      subtitle: buyXGetYData.subtitle,
      badgeText: buyXGetYData.badgeText,
      badgeStyle: buyXGetYData.badgeStyle,
      labelText: buyXGetYData.labelText,
      isSelectedByDefault: buyXGetYData.isSelectedByDefault,
      isShowAsSoldOut: buyXGetYData.isShowAsSoldOut,
      labelTitle: buyXGetYData.labelTitle,
      opacity: buyXGetYData.opacity,
      bgColor: buyXGetYData.bgColor,
      textColor: buyXGetYData.textColor,
      labelSize: buyXGetYData.labelSize,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  // DELETE upsellItems removed from frontend
  if (buyXGetYData.upsellItemsToDeleteIds.length > 0) {
    await db.bxGyUpsellItem.deleteMany({
      where: { id: { in: buyXGetYData.upsellItemsToDeleteIds } }
    });
  }
  // const incomingIds = buyXGetYData.upsellItems
  //   .map(u => u.id)
  //   .filter(Boolean);
  // await db.bxGyUpsellItem.deleteMany({
  //   where: {
  //     bxGyId: buyXGetY.id,
  //     id: { notIn: incomingIds },
  //   },
  // });
  // UPSERT each upsell
  for (const u of buyXGetYData.upsellItems) {
    await db.bxGyUpsellItem.upsert({
      where: { id: u.id ?? crypto.randomUUID() },
      update: {
        isSelectedProduct: u.isSelectedProduct,
        selectedVariants: u.selectedVariants,
        selectedProduct: u.selectedProduct,
        selectPrice: u.selectPrice,
        quantity: u.quantity,
        base: u.base || 10,
        calc: u.calc || 20,
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
        buyXGetY: {
          connect: { id: buyXGetY.id }
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
        buyXGetY: {
          connect: { id: buyXGetY.id }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }
  return buyXGetY;
}

export async function updateBuyXGetYs(buyXGetYList) {
  // const newIds = buyXGetYList.map(r => r.id);
  // await db.buyXGetY.deleteMany({
  //   where: {
  //     id: { notIn: newIds }
  //   }
  // });
  return Promise.all(buyXGetYList.map(buyXGetY => updateBuyXGetY(buyXGetY)));
}

export async function deleteBuyXGetYs(params: { id?: string, bundleId?: string }) {
  const { id, bundleId } = params;
  if (!id && !bundleId) {
    throw new Error("Must provide id or bundleId");
  }
  await db.buyXGetY.deleteMany({
    where: {
      OR: [
        id ? { id } : undefined,
        bundleId ? { bundleId } : undefined,
      ].filter(Boolean) as any[],
    },
  });
}
