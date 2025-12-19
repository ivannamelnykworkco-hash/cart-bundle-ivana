// app/models/bundle.server.ts
import type { GeneralStyle } from "./types";
import db from "../db.server";

const defaultColor = "#000000";

export async function getGeneralStyle(bundleId: string): Promise<GeneralStyle> {
  const result = await db.generalStyle.findFirst({
    where: {
      bundleId: bundleId
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  if (result)
    return result;
  //if no result then send init result
  const init = await db.generalStyle.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      bundleId: bundleId,
      cornerRadius: 0,
      spacing: 0,
      cardsBgColor: defaultColor,
      selectedBgColor: defaultColor, //
      borderColor: defaultColor,//
      blockTitleColor: defaultColor,
      barTitleColor: defaultColor,
      barSubTitleColor: defaultColor,
      barPriceColor: defaultColor,
      barFullPriceColor: defaultColor,
      barLabelBackColor: defaultColor,
      barLabelTextColor: defaultColor,
      barBadgebackColor: defaultColor,
      barBadgeTextColor: defaultColor,
      barUpsellBackColor: defaultColor,
      barUpsellTextColor: defaultColor,
      barUpsellSelectedBackColor: defaultColor,////
      barUpsellSelectedTextColor: defaultColor,////
      barBlocktitle: 10,
      barBlocktitleFontStyle: "styleRegular",
      bartitleSize: 10,
      bartitleFontStyle: "styleRegular",
      subTitleSize: 10,
      subTitleStyle: "styleRegular",
      labelSize: 10,
      labelStyle: "styleRegular",
      upsellSize: 10,
      upsellStyle: "styleRegular",
      unitLabelSize: 10,
      unitLabelStyle: "styleRegular",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });
  return init;
}

export async function updateGeneralStyle(id: string, data: Partial<GeneralStyle>) {
  const updateData: any = {
    bundleId: data.bundleId,
    cornerRadius: parseInt(data.cornerRadius, 10),
    spacing: parseInt(data.spacing, 10),
    cardsBgColor: data.cardsBgColor,
    selectedBgColor: data.selectedBgColor, //
    borderColor: data.borderColor,//
    blockTitleColor: data.blockTitleColor,
    barTitleColor: data.barTitleColor,
    barSubTitleColor: data.barSubTitleColor,
    barPriceColor: data.barPriceColor,
    barFullPriceColor: data.barFullPriceColor,
    barLabelBackColor: data.barLabelBackColor,
    barLabelTextColor: data.barLabelTextColor,
    barBadgebackColor: data.barBadgebackColor,
    barBadgeTextColor: data.barBadgeTextColor,
    barUpsellBackColor: data.barUpsellBackColor,
    barUpsellTextColor: data.barUpsellTextColor,
    barUpsellSelectedBackColor: data.barUpsellSelectedBackColor,////
    barUpsellSelectedTextColor: data.barUpsellSelectedTextColor,////
    barBlocktitle: parseInt(data.barBlocktitle, 10),
    barBlocktitleFontStyle: data.barBlocktitleFontStyle,
    bartitleSize: parseInt(data.bartitleSize, 10),
    bartitleFontStyle: data.bartitleFontStyle,
    subTitleSize: parseInt(data.subTitleSize, 10),
    subTitleStyle: data.subTitleStyle,
    labelSize: parseInt(data.labelSize, 10),
    labelStyle: data.labelStyle,
    upsellSize: parseInt(data.upsellSize, 10),
    upsellStyle: data.upsellStyle,
    unitLabelSize: parseInt(data.unitLabelSize, 10),
    unitLabelStyle: data.unitLabelStyle,
    updatedAt: new Date().toISOString(),
  }
  Object.keys(updateData).forEach(
    (key) => (updateData[key] == null) && delete updateData[key]
  );
  // Then run the Prisma update
  const result = await db.generalStyle.update({
    where: { id },
    data: updateData,
  });
  return result;
}

export async function deleteGeneralStyle(params: { id?: string, bundleId?: string }) {
  const { id, bundleId } = params;
  if (!id && !bundleId) {
    throw new Error("Must provide id or bundleId");
  }
  await db.generalStyle.deleteMany({
    where: {
      OR: [
        id ? { id } : undefined,
        bundleId ? { bundleId } : undefined,
      ].filter(Boolean) as any[],
    },
  });
}
