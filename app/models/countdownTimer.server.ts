// app/models/bundle.server.ts
import type { CountdownTimer } from "./types";
import db from "../db.server";
import { CountDownPanel } from "app/components/bundles/CountDownPanel";


function parseBoolean(str) {
  return str === 'true';
}

function parseNumber(str) {
  return Number(str);
}
// This is a placeholder for database operations
// Replace with your actual database (Prisma, MongoDB, etc.)

//export async function getCountdownTimer(id: string): Promise<CountdownTimer | null> {
export async function getCountdownTimer(): Promise<CountdownTimer> {
  //  export async function getGeneralSetting(id: string): Promise<GeneralSetting[]> {

  // TODO: Implement database query
  const result = await db.countdownTimer.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
  //if no result then send init result 
  if (!result) {
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
  };
  return result;
}

export async function createCountdownTimer(data: Partial<CountdownTimer>) {
  const result = await db.countdownTimer.create({
    data: {
      id: Math.random().toString(36).substr(2, 9),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });


  return result;
}

export async function updateCountdownTimer(id: string, data: Partial<CountdownTimer>) {
  const result = await db.countdownTimer.update({
    where: { id },
    data: {
      id: data.id,//Math.random().toString(36).substr(2, 9),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
  return result;
}

