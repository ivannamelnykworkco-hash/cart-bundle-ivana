import type { CountdownTimer } from "./types";
import db from "../db.server";

export async function getCountdownTimer(): Promise<CountdownTimer> {
  // TODO: Implement database query
  const result = await db.countdownTimer.findFirst({
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
      isCountdown: false,
      visibility: "showFixedDuration",
      fixedDurationTime: 0,
      endDateTime: new Date().toISOString(),
      msgText: "Text",
      msgAlignment: 0,
      msgBold: false,
      msgItalic: false,
      msgSize: 0,
      msgBgColor: "#FF0000",////////////
      msgTextColor: "#00FF00",////////////
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  });
  return init;
}

export async function updateCountdownTimer(id: string, data: Partial<CountdownTimer>) {
  const updateData: any = {
    isCountdown: data.showCountdownTimer === "true",
    visibility: data.visibility,
    fixedDurationTime: parseInt(data.timeDuration, 10),
    endDateTime: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
    msgText: data.textValue,
    msgAlignment: parseInt(data.activeAlignmentButtonIndex, 10),
    msgBold: data.activeTextBoldButton === "true",
    msgItalic: data.activeTextItalicButton === "true",
    msgSize: parseInt(data.textFontSize, 10),
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

