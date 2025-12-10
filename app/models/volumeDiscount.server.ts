// app/models/bundle.server.ts
import type { VolumeDiscount } from "./types";
import db from "../db.server";

const defaultColor = "#00DDDD"

export async function getVolumeDiscount(): Promise<VolumeDiscount> {
  const result = await db.volumeDiscount.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  });
  if (result)
    return result;
  //if no result then send init result
  const init = await db.volumeDiscount.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      bundleId: Math.random().toString(36).substr(2, 9),
      visibility: "productsExcept", //
      layoutImageUrl: "",
      layoutButtonText: "Layout Button", //
      layoutColor: defaultColor,
      productPhotoSize: 10,  //
      showProductName: true,  //
      showPrice: true,  //
      customButtonSize: 10, //
      customTextSize: 10, //
      customOverlayColor: defaultColor,
      customPriceColor: defaultColor,
      customCompareAtPriceColor: defaultColor,
      customTextColor: defaultColor,
      customButtonColor: defaultColor,
      customButtonTextColor: defaultColor,
      customHeadingText: "text", //
      customMessageText: "text", //
      customButtonText: "button", //
      customPhotoSize: 10, //
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });
  return init;
}

export async function updateVolumeDiscount(id: string, data: Partial<VolumeDiscount>) {
  const updateData: any = {
    bundleId: data.bundleId,
    visibility: data.eligible,
    layoutImageUrl: data.imageData,
    layoutButtonText: data.volumeButtonText,
    layoutColor: data.layoutColor,
    productPhotoSize: parseInt(data.photoSize, 10),
    showProductName: data.isProductName === "true",
    showPrice: data.isShowPrice === "true",
    customButtonSize: parseInt(data.primaryButtonSize, 10),
    customTextSize: parseInt(data.textSize, 10),
    customOverlayColor: data.overlayColor,
    customPriceColor: data.priceColor,
    customCompareAtPriceColor: data.compareAtPriceColor,
    customTextColor: data.textColor,
    customButtonColor: data.buttonColor,
    customButtonTextColor: data.buttonTextColor,
    customHeadingText: data.heading,
    customMessageText: data.customMessageText,
    customButtonText: data.buttonText,
    customPhotoSize: parseInt(data.customPhotoSize, 10),
    updatedAt: new Date().toISOString(),
  };

  // Remove fields that are undefined or null
  Object.keys(updateData).forEach(
    (key) => (updateData[key] == null) && delete updateData[key]
  );

  // Then run the Prisma update
  const result = await db.volumeDiscount.update({
    where: { id },
    data: updateData,
  });
  return result;
}
