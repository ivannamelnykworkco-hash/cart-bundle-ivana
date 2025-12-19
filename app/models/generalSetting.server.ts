// app/models/bundle.server.ts
import type { GeneralSetting } from "./types";
import db from "../db.server";

export async function getGeneralSetting(bundleId: string): Promise<GeneralSetting> {

  // TODO: Implement database query
  const result = await db.generalSetting.findFirst({
    where: {
      bundleId: bundleId
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  if (result) {
    return result;
  }

  // const bundleCount = await db.generalSetting.count({
  //   where: {
  //     bundleId: { not: null } // adjust filter if needed
  //   }
  // });
  // const nextBundleNumber = bundleCount + 1;


  //if no result then send init result
  const init = await db.generalSetting.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      bundleId: bundleId,
      discountId: "",
      bundleName: 'Bundle #1',
      discountName: "Discount #1",
      blockTitle: "Block",
      visibility: "all",
      markets: "all",
      excludedProducts: "",
      excludedCollections: "",
      selectedProducts: "",
      selectedCollections: "",
      excludeB2B: false,
      excludePOS: false,
      startDateTime: new Date().toISOString(),
      setEndDate: false,
      endDateTime: new Date().toISOString(),
      letCustomer: false,
      showVariant: false,
      hideTheme: false,
      colorSwatchArray: "",
      imageSwatchArray: "",
      swatchOption: "isDenomination",
      swatchType: "isDefaultDropdown",
      swatchSize: 10,
      swatchShape: "isCircle",
      setDefaultVariant: "",
      showPrices: false,
      showBothPrices: false,
      unitLabel: "",
      useProductCompare: false,
      showPricesWithout: false,
      showPriceRounding: false,
      priceRounding: ".99",
      updateTheme: false,
      priceSelect: "pi",
      skipCart: false,
      showAlert: false,
      showWhenStock: 5,
      msgText: "Only {{stock}} left",
      msgColor: "#000000",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });
  return init;
}

export async function updateGeneralSetting(id: string, data: Partial<GeneralSetting>) {
  const updateData: any = {
    bundleId: data.bundleId ?? "",
    discountId: data?.discountId ?? "",
    bundleName: data.bundleName,
    discountName: data.discountName,
    blockTitle: data.blockTitle,
    visibility: data.visibility,
    markets: data.markets,
    excludeB2B: data.excludeB2B === "true",
    startDateTime: new Date(`${data.startDate}T${data.startTime}`).toISOString(),
    setEndDate: data.endStateDate === "true",
    endDateTime: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
    letCustomer: data.variant === "true",
    showVariant: data.variantSingle === "true",
    setDefaultVariant: data.defaultVariant || "",
    hideTheme: data.hidnPicker === "true",
    showPrices: data.showPricesItem === "true",
    showBothPrices: data.showBothPrices === "true",
    unitLabel: data.unitLabel,
    useProductCompare: data.compareAtPrice === "true",
    showPricesWithout: data.showPriceDecimal === "true",
    showPriceRounding: data.priceRounding === "true",
    priceRounding: data.roundingValue,
    updateTheme: data.updatePrice === "true",
    priceSelect: data.updatePriceSelect,
    skipCart: data.isGoCheckout === "true",
    showAlert: data.isShowLowAlert === "true",
    // showWhenStock: parseInt(data.showStock, 10),
    msgText: data.textValue,
    msgColor: data.textColor,
    excludedProducts: data.excludedProductData,
    excludedCollections: data.excludedCollectionData,
    selectedProducts: data.selectedProductData,
    selectedCollections: data.selectedCollectionData,
    updatedAt: new Date().toISOString()
  };

  Object.keys(updateData).forEach(
    (key) => (updateData[key] == null) && delete updateData[key]
  );

  const result = await db.generalSetting.update({
    where: { id },
    data: updateData,
  });
  return result;
}

export async function deleteGeneralSetting(params: { id?: string, bundleId?: string }) {
  const { id, bundleId } = params;
  if (!id && !bundleId) {
    throw new Error("Must provide id or bundleId");
  }
  await db.generalSetting.deleteMany({
    where: {
      OR: [
        id ? { id } : undefined,
        bundleId ? { bundleId } : undefined,
      ].filter(Boolean) as any[],
    },
  });
}