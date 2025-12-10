import db from "../db.server";

export async function getQuantityBreaks() {
  return db.quantityBreak.findMany({
    include: {
      upsellItems: true
    },
    orderBy: {
      updatedAt: "desc" // optional, order by updatedAt
    }
  });
}

export async function updateQuantityBreak(data) {
  // prepare data for update
  const qbData: any = {
    id: data.id || null,
    bundleId: data.bundleId || "",
    title: data.title || "",
    subtitle: data.subtitle || "",
    quantity: data.quantity ? parseInt(data.quantity, 10) : 1,
    isOpen: data.isOpen === "true",
    selectPrice: data.selectPrice || "",
    discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : 0,
    badgeText: data.badgeText || "",
    badgeStyle: data.badgeStyle || "",
    label: data.label || "",
    isSelectedByDefault: data.isSelectedByDefault === "true",
    isShowAsSoldOut: data.isShowAsSoldOut === "true",
    labelTitle: data.labelTitle || "",
    opacity: data.opacity ? parseFloat(data.opacity) : 1,
    bgColor: data.bgColor || "",
    textColor: data.textColor || "",
    labelSize: data.labelSize ? parseInt(data.labelSize, 10) : 12,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (data.upsellItems) {
    try {
      qbData.upsellItems = JSON.parse(data.upsellItems).map((u: any) => ({
        id: u.id || null,
        qbId: u.qbId || null,
        bxGyId: u.bxGyId || null,
        buId: u.buId || null,
        isSelectedProduct: u.isSelectedProduct === true || u.isSelectedProduct === "true",
        selectedVariants: u.selectedVariants || "",
        selectPrice: u.selectPrice || "",
        discountPrice: u.discountPrice ? parseFloat(u.discountPrice) : 0,
        priceText: u.priceText || "",
        isSelectedByDefault: u.isSelectedByDefault === true || u.isSelectedByDefault === "true",
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
      qbData.upsellItems = [];
    }
  } else {
    qbData.upsellItems = [];
  }

  // Deleted upsells
  if (data.upsellItemsToDeleteIds) {
    try {
      qbData.upsellItemsToDeleteIds = JSON.parse(data.upsellItemsToDeleteIds);
    } catch {
      qbData.upsellItemsToDeleteIds = [];
    }
  } else {
    qbData.upsellItemsToDeleteIds = [];
  }

  // UPSERT QuantityBreak
  const quantityBreak = await db.quantityBreak.upsert({
    where: { id: qbData.id ?? crypto.randomUUID() },
    update: {
      bundleId: qbData.bundleId,
      title: qbData.title,
      subtitle: qbData.subtitle,
      quantity: qbData.quantity,
      isOpen: qbData.isOpen,
      selectPrice: qbData.selectPrice,
      discountPrice: qbData.discountPrice,
      badgeText: qbData.badgeText,
      badgeStyle: qbData.badgeStyle,
      label: qbData.label,
      isSelectedByDefault: qbData.isSelectedByDefault,
      isShowAsSoldOut: qbData.isShowAsSoldOut,
      labelTitle: qbData.labelTitle,
      opacity: qbData.opacity,
      bgColor: qbData.bgColor,
      textColor: qbData.textColor,
      labelSize: qbData.labelSize,
      updatedAt: new Date().toISOString()
    },
    create: {
      bundleId: qbData.bundleId,
      title: qbData.title,
      subtitle: qbData.subtitle,
      quantity: qbData.quantity,
      isOpen: qbData.isOpen,
      selectPrice: qbData.selectPrice,
      discountPrice: qbData.discountPrice,
      badgeText: qbData.badgeText,
      badgeStyle: qbData.badgeStyle,
      label: qbData.label,
      isSelectedByDefault: qbData.isSelectedByDefault,
      isShowAsSoldOut: qbData.isShowAsSoldOut,
      labelTitle: qbData.labelTitle,
      opacity: qbData.opacity,
      bgColor: qbData.bgColor,
      textColor: qbData.textColor,
      labelSize: qbData.labelSize,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  // DELETE upsellItems removed from frontend
  if (qbData.upsellItemsToDeleteIds.length > 0) {
    await db.upsellItem.deleteMany({
      where: { id: { in: qbData.upsellItemsToDeleteIds } }
    });
  }

  // UPSERT each upsell
  for (const u of qbData.upsellItems) {
    const relationData: any = {};
    // only one relation should be attached
    if (u.qbId) {
      relationData.qbId = quantityBreak.id;
    }
    if (u.bxGyId) {
      relationData.bxGyId = u.bxGyId;
    }
    if (u.buId) {
      relationData.buId = u.buId;
    }
    await db.upsellItem.upsert({
      where: { id: u.id ?? crypto.randomUUID() },
      update: {
        ...relationData,
        isSelectedProduct: u.isSelectedProduct,
        selectedVariants: u.selectedVariants,
        selectPrice: u.selectPrice,
        discountPrice: u.discountPrice,
        priceText: u.priceText,
        isSelectedByDefault: u.isSelectedByDefault,
        isVisibleOnly: u.isVisibleOnly,
        isShowAsSoldOut: u.isShowAsSoldOut,
        labelTitle: u.labelTitle,
        opacity: u.opacity,
        bgColor: u.bgColor,
        textColor: u.textColor,
        labelSize: u.labelSize,
        quantityBreak: {
          connect: { id: quantityBreak.id }
        },
        buyXGetY: {},
        bundleUpsell: {},
        updatedAt: new Date().toISOString()
      },
      create: {
        ...relationData,
        isSelectedProduct: u.isSelectedProduct,
        selectedVariants: u.selectedVariants,
        selectPrice: u.selectPrice,
        discountPrice: u.discountPrice,
        priceText: u.priceText,
        isSelectedByDefault: u.isSelectedByDefault,
        isVisibleOnly: u.isVisibleOnly,
        isShowAsSoldOut: u.isShowAsSoldOut,
        labelTitle: u.labelTitle,
        opacity: u.opacity,
        bgColor: u.bgColor,
        textColor: u.textColor,
        labelSize: u.labelSize,
        quantityBreak: {
          connect: { id: quantityBreak.id }
        },
        buyXGetY: {},
        bundleUpsell: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }
  return quantityBreak;
}

export async function updateQuantityBreaks(qbList) {
  return Promise.all(qbList.map(qb => updateQuantityBreak(qb)));
}