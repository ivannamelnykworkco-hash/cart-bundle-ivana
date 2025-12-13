import db from "../db.server";
import type { QuantityBreak } from "./types";

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
    id: String(data.id) || null,
    bundleId: data.bundleId || "",
    title: data.title || "",
    subtitle: data.subtitle || "",
    quantity: data.quantity ? parseInt(data.quantity, 10) : 1,
    isOpen: data.isOpen === "true",
    selectPrice: data.selectPrice || "",
    discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : 0,
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
      // qbData.upsellItems = JSON.parse(data.upsellItems).map((u: any) => ({
      qbData.upsellItems = data.upsellItems.map((u: any) => ({
        id: String(u.id) || null,
        qbId: u.qbId || null,
        bxGyId: u.bxGyId || null,
        buId: u.buId || null,
        isSelectedProduct: u.isSelectedProduct || "",
        selectedVariants: u.selectedVariants || "",
        selectPrice: u.selectPrice || "",
        quantity: parseInt(u.quantity, 10) || 1,
        discountPrice: u.discountPrice ? parseFloat(u.discountPrice) : 0,
        priceText: u.priceText || "",
        imageSize: parseInt(u.imageSize, 10) || 12,
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
      labelText: qbData.labelText,
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
      id: qbData.id,
      bundleId: qbData.bundleId,
      title: qbData.title,
      subtitle: qbData.subtitle,
      quantity: qbData.quantity,
      isOpen: qbData.isOpen,
      selectPrice: qbData.selectPrice,
      discountPrice: qbData.discountPrice,
      badgeText: qbData.badgeText,
      badgeStyle: qbData.badgeStyle,
      labelText: qbData.labelText,
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
    await db.qbUpsellItem.deleteMany({
      where: { id: { in: qbData.upsellItemsToDeleteIds } }
    });
  }

  const incomingIds = qbData.upsellItems
    .map(u => u.id)
    .filter(Boolean);

  await db.qbUpsellItem.deleteMany({
    where: {
      qbId: quantityBreak.id,
      id: { notIn: incomingIds },
    },
  });
  // UPSERT each upsell
  for (const u of qbData.upsellItems) {

    await db.qbUpsellItem.upsert({
      where: { id: u.id ?? crypto.randomUUID() },
      update: {
        isSelectedProduct: u.isSelectedProduct,
        selectedVariants: u.selectedVariants,
        selectPrice: u.selectPrice,
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
        quantityBreak: {
          connect: { id: quantityBreak.id }
        },
        updatedAt: new Date().toISOString()
      },
      create: {
        isSelectedProduct: u.isSelectedProduct,
        selectedVariants: u.selectedVariants,
        selectPrice: u.selectPrice,
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
        quantityBreak: {
          connect: { id: quantityBreak.id }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }
  return quantityBreak;
}

export async function updateQuantityBreaks(qbList) {
  const newIds = qbList.map(r => r.id);
  await db.quantityBreak.deleteMany({
    where: {
      id: { notIn: newIds }
    }
  });
  return Promise.all(qbList.map(qb => updateQuantityBreak(qb)));
}

