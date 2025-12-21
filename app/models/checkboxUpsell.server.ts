import type { CheckboxUpsell } from "./types";
import db from "../db.server";

export async function getCheckboxUpsell(bundleId: string): Promise<CheckboxUpsell> {
  // TODO: Implement database query
  const result = await db.checkboxUpsell.findFirst({
    where: {
      bundleId: bundleId
    },
    orderBy: {
      updatedAt: 'desc',
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
    bundleId: data.bundleId,
    upsellData: data.upsellData ?? "",
    selectedProduct: data.selectedProduct ?? null,
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

export async function deleteCheckboxUpsell(params: { id?: string, bundleId?: string }) {
  const { id, bundleId } = params;
  if (!id && !bundleId) {
    throw new Error("Must provide id or bundleId");
  }
  await db.checkboxUpsell.deleteMany({
    where: {
      OR: [
        id ? { id } : undefined,
        bundleId ? { bundleId } : undefined,
      ].filter(Boolean) as any[],
    },
  });
}