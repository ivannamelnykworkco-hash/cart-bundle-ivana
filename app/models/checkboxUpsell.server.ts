import type { CheckboxUpsell } from "./types";
import db from "../db.server";

export async function getCheckboxUpsell(): Promise<CheckboxUpsell> {
  // TODO: Implement database query
  const result = await db.checkboxUpsell.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (result)
    return result;
  return [];

}

export async function updateCheckboxUpsell(id: string, data: Partial<CheckboxUpsell>) {
  const updateData: any = {
    upsellData: data.upsellData,
    updatedAt: new Date().toISOString()
  };

  Object.keys(updateData).forEach(
    (key) => (updateData[key] == null) && delete updateData[key]
  );

  const createData: any = {
    id: Math.random().toString(36).substr(2, 9),
    bundleId: Math.random().toString(36).substr(2, 9),
    upsellData: data.upsellData ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const result = await db.checkboxUpsell.upsert({
    where: { id },
    update: updateData,
    create: createData,
  });
  return result;
}

