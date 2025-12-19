import type { CountdownTimer } from "./types";
import db from "../db.server";

export async function getCountdownTimer(bundleId: string): Promise<CountdownTimer> {
  // TODO: Implement database query
  const result = await db.countdownTimer.findFirst({
    where: {
      bundleId: bundleId
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  if (result)
    return result;
  //if no result then create and send init result 
  const init = await db.countdownTimer.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
      bundleId: bundleId,
      isCountdown: false,
      visibility: "showFixedDuration",
      fixedDurationTime: 0,
      endDateTime: new Date().toISOString(),
      msgText: "Hurry! Offer expires in {{timer}} ⏰",
      msgAlignment: 1,
      msgBold: true,
      msgItalic: false,
      msgSize: 13,
      msgBgColor: "#d9edff",////////////
      msgTextColor: "#000000",////////////
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });
  return init;
}

export async function updateCountdownTimer(id: string, data: Partial<CountdownTimer>) {
  const updateData: any = {
    bundleId: data.bundleId,
    isCountdown: data.showCountdownTimer === "true",
    visibility: data.visibility,
    fixedDurationTime: parseInt(data.timeDuration, 10),
    endDateTime: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
    msgText: data.textValue,
    msgAlignment: parseInt(data.activeAlignmentButtonIndex, 10),
    msgBold: data.activeTextBoldButton === "true",
    msgItalic: data.activeTextItalicButton === "true",
    msgSize: parseInt(data.textFontSize, 13),
    msgBgColor: data.msgBgColor,  ////
    msgTextColor: data.msgTextColor,  ////
    updatedAt: new Date().toISOString()
  };

  Object.keys(updateData).forEach(
    (key) => (updateData[key] == null) && delete updateData[key]
  );

  const result = await db.countdownTimer.update({
    where: { id },
    data: updateData,
  });
  return result;
}

export async function deleteCountdownTimer(params: { id?: string, bundleId?: string }) {
  const { id, bundleId } = params;
  if (!id && !bundleId) {
    throw new Error("Must provide id or bundleId");
  }
  await db.countdownTimer.deleteMany({
    where: {
      OR: [
        id ? { id } : undefined,
        bundleId ? { bundleId } : undefined,
      ].filter(Boolean) as any[],
    },
  });
}