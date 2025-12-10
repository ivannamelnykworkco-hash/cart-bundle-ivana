import type { StickyAdd } from "./types";
import db from "../db.server";

export async function getStickyAdd(): Promise<StickyAdd> {
  // TODO: Implement database query
  const result = await db.stickyAdd.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  });
  if (result)
    return result;
  //if no result then create and send init result 
  const init = await db.stickyAdd.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      bundleId: Math.random().toString(36).substr(2, 9),
      contentTitleText: "",
      contentButtonText: "",
      styleBgColor: "#FF0000",
      styleTitleColor: "#00FF00",
      styleButtonColor: "#0000FF",
      styleButtonTextColor: "#FF00FF",
      styleTitleFontSize: 15,
      styleTitleFontStyle: "",
      styleButtonFontSize: 15,
      styleButtonFontStyle: "",
      stylePhotoSize: 15,
      stylePhotoCornerRadius: 15,
      styleButtonPadding: 15,
      styleButtonCornerRadius: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
  return init;
}

export async function updateStickyAdd(id: string, data: Partial<StickyAdd>) {
  const updateData: any = {
    bundleId: data.bundleId,
    contentTitleText: data.contentTitleText,
    contentButtonText: data.contentButtonText,
    styleBgColor: data.styleBgColor,
    styleTitleColor: data.styleTitleColor,
    styleButtonColor: data.styleButtonColor,
    styleButtonTextColor: data.styleButtonTextColor,
    styleTitleFontSize: parseInt(data.styleTitleFontSize, 10),
    styleTitleFontStyle: data.styleTitleFontStyle,
    styleButtonFontSize: parseInt(data.styleButtonFontSize, 10),
    styleButtonFontStyle: data.styleButtonFontStyle,
    stylePhotoSize: parseInt(data.stylePhotoSize, 10),
    stylePhotoCornerRadius: parseInt(data.stylePhotoCornerRadius, 10),
    styleButtonPadding: parseInt(data.styleButtonPadding, 10),
    styleButtonCornerRadius: parseInt(data.styleButtonCornerRadius, 10),
    updatedAt: new Date().toISOString()
  };

  Object.keys(updateData).forEach(
    (key) => (updateData[key] == null) && delete updateData[key]
  );

  const result = await db.stickyAdd.update({
    where: { id },
    data: updateData,
  });
  return result;
}