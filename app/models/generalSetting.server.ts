// app/models/bundle.server.ts
import type { GeneralSetting } from "./types";
import db from "../db.server";

// This is a placeholder for database operations
// Replace with your actual database (Prisma, MongoDB, etc.)

export async function getGeneralSetting(id: string): Promise<GeneralSetting> {
  //  export async function getGeneralSetting(id: string): Promise<GeneralSetting[]> {

  // TODO: Implement database query
  const result = await db.generalSetting.findFirst({ where: { id } });

  if (result) {
    return result;
  }

  return { id: '', bundleName: '', discountName: '' }
}


export async function createGeneralSetting(data: Partial<GeneralSetting>): Promise<GeneralSetting> {
  // data: Partial<GeneralSetting>, i: string): Promise<GeneralSetting> {
  // TODO: Implement database insert
  //  await db.generalSetting.create({ data: generalSetting })
  const sample: GeneralSetting = {
    id: Math.random().toString(36).substr(2, 9),
    bundleName: data.bundleName || "New Bundle",
    discountName: data.discountName || "New Discount",
    // selectedProducts: "draft",
    // products: data.products || [],
    // discountType: data.discountType || "percentage",
    // discountValue: data.discountValue || 0,
    // stats: {
    //   visitors: 0,
    //   conversionRate: 0,
    //   bundlesRate: 0,
    //   aov: 0,
    //   addedRevenue: 0,
    //   totalRevenue: 0,
    //   revenuePerVisitor: 0,
    //   profitPerVisitor: 0,
    // },
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    // settings: data.settings || {},
  };

  return sample;
}

// export async function updateBundle(id: string, data: Partial<Bundle>, shopId: string): Promise<Bundle> {
//   // TODO: Implement database update
//   const bundle = await getBundleById(id, shopId);
//   if (!bundle) {
//     throw new Error("Bundle not found");
//   }

//   return {
//     ...bundle,
//     ...data,
//     updatedAt: new Date().toISOString(),
//   };
// }

// export async function deleteBundle(id: string, shopId: string): Promise<void> {
//   // TODO: Implement database delete
// }

// export async function updateBundleStats(id: string, stats: Partial<Bundle["stats"]>, shopId: string): Promise<void> {
//   // TODO: Implement stats update
// }