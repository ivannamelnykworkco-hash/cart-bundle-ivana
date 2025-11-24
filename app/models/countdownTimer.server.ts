// app/models/bundle.server.ts
import type { CountdownTimer } from "./types";
import db from "../db.server";
import { CountDownPanel } from "app/components/bundles/CountDownPanel";

// This is a placeholder for database operations
// Replace with your actual database (Prisma, MongoDB, etc.)

//export async function getCountdownTimer(id: string): Promise<CountdownTimer | null> {
export async function getCountdownTimer(): Promise<CountdownTimer | null> {
  //  export async function getGeneralSetting(id: string): Promise<GeneralSetting[]> {

  // TODO: Implement database query
  const result = await db.countdownTimer.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (result) {
    return result;
  }
  return null;

}

export async function createCountdownTimer(): Promise<CountdownTimer> {
  //  export async function createCountdownTimer(data: Partial<CountdownTimer>): Promise<CountdownTimer> {

  //  await db.generalSetting.create({ data: generalSetting })
  const sample: CountdownTimer = {
    id: Math.random().toString(36).substr(2, 9),
    isCountdown: false,
    visibility: "showFixedDuration",
    fixedDurationTime: 0,
    endDateTime: new Date().toISOString(),
    msgText: "msgText1",
    msgAlignment: 0,
    msgBold: false,
    msgItalic: false,
    msgSize: 14,
    msgBgColor: "#FF0000",
    msgTextColor: "#00FF00",
    createdAt: new Date().toISOString()
  };
  await db.countdownTimer.create({ data: sample });

  return sample;
}

