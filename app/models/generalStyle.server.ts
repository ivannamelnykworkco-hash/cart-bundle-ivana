// app/models/bundle.server.ts
import type { GeneralStyle } from "./types";
import db from "../db.server";

function parseBoolean(str) {
  return str === 'true';
}

function parseNumber(str) {
  return Number(str);
}


const defaultColorHSB = "#FF0000";

//const defaultColor = JSON.stringify(defaultColorHSB);

const defaultColor = "#00FF00"
// This is a placehold;er for database operations
// Replace with your actual database (Prisma, MongoDB, etc.)

export async function getGeneralStyle(): Promise<GeneralStyle> {
  const result = await db.generalStyle.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (result)
    return result;
  //if no result then send init result
  const init = await db.generalStyle.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      bundleId: Math.random().toString(36).substr(2, 9),
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

export async function updateGeneralStyle(id: string, data: Partial<CountdownTimer>) {
  const result = await db.generalStyle.update({
    where: { id },
    data: {
      bundleId: data.bundleId,
      cornerRadius: parseInt(data.cornerRadius, 10),
      spacing: parseInt(data.spacing, 10),
      // cardsBgColor: JSON.stringify(data.cardsBgColor),
      // selectedBgColor: JSON.stringify(data.selectedBgColor), //
      // borderColor: JSON.stringify(data.borderColor),//
      // blockTitleColor: JSON.stringify(data.blockTitleColor),
      // barTitleColor: JSON.stringify(data.barTitleColor),
      // barSubTitleColor: JSON.stringify(data.barSubTitleColor),
      // barPriceColor: JSON.stringify(data.barPriceColor),
      // barFullPriceColor: JSON.stringify(data.barFullPriceColor),
      // barLabelBackColor: JSON.stringify(data.barLabelBackColor),
      // barLabelTextColor: JSON.stringify(data.barLabelTextColor),
      // barBadgebackColor: JSON.stringify(data.barBadgebackColor),
      // barBadgeTextColor: JSON.stringify(data.barBadgeTextColor),
      // barUpsellBackColor: JSON.stringify(data.barUpsellBackColor),
      // barUpsellTextColor: JSON.stringify(data.barUpsellTextColor),
      // barUpsellSelectedBackColor: JSON.stringify(data.barUpsellSelectedBackColor),////
      // barUpsellSelectedTextColor: JSON.stringify(data.barUpsellSelectedTextColor),////
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
      createdAt: data.createdAt,
      updatedAt: new Date().toISOString(),
    }
  });
  return result;
}


// export async function createCountdownTimer(data: Partial<CountdownTimer>) {
//   const result = await db.countdownTimer.create({
//     data: {
//       id: Math.random().toString(36).substr(2, 9),
//       isCountdown: data.showCountdownTimer === "true",
//       visibility: data.visibility,
//       fixedDurationTime: parseInt(data.timeDuration, 10),
//       endDateTime: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
//       msgText: data.textValue,
//       msgAlignment: parseInt(data.activeAlignmentButtonIndex, 10),
//       msgBold: data.activeTextBoldButton === "true",
//       msgItalic: data.activeTextItalicButton === "true",
//       msgSize: parseInt(data.textFontSize, 10),
//       msgBgColor: data.msgBgColor,  ////
//       msgTextColor: data.msgTextColor,  ////
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     }
//   });
//   return result;
// }

