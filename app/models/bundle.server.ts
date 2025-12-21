// app/models/bundle.server.ts
import type { Bundle, BundleType, BundleStatus } from "./types";
import db from "../db.server";

// This is a placeholder for database operations
// Replace with your actual database (Prisma, MongoDB, etc.)

export async function getBundles(): Promise<Bundle[]> {
  // TODO: Implement database query
  const result = await db.bundle.findMany({
    orderBy: {
      updatedAt: 'desc',
    }
  });
  return result;
}

export async function getBundle(id?: string): Promise<Bundle> {
  // TODO: Implement database query
  if (id) {
    const result = await db.bundle.findUnique({
      where: { id },
    });
    return result;
  }
  else {
    const result = await db.bundle.findFirst({
      orderBy: {
        updatedAt: 'desc',
      }
    });
    return result;
  }
}

export async function createBundle(data?: Partial<Bundle>, shopId?: string): Promise<Bundle> {
  // TODO: Implement database insert
  if (data) {
    const bundle: Bundle = {
      shop: "",
      name: data.name || "Name",
      type: data.type || "single",
      products: data.products || [],
      status: "draft",
      discountId: data.discountId || "",
      discountType: data.discountType || "",
      discountValue: data.discountValue || 0,
      stats: {
        visitors: 0,
        conversionRate: 0,
        bundlesRate: 0,
        aov: 0,
        addedRevenue: 0,
        totalRevenue: 0,
        revenuePerVisitor: 0,
        profitPerVisitor: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: data.settings || {},
    };
    const init = await db.bundle.create(bundle);
    return init;
  }
  else {
    const init = await db.bundle.create({
      data: {
        shop: "",
        name: "Name",
        type: "single",
        products: "[]",
        status: "draft",
        discountId: null,
        discountType: "",
        discountValue: 0,
        stats: {
          visitors: 0,
          conversionRate: 0,
          bundlesRate: 0,
          aov: 0,
          addedRevenue: 0,
          totalRevenue: 0,
          revenuePerVisitor: 0,
          profitPerVisitor: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {},
      }
    });
    return init;
  }
}
export async function updateBundle(id: string, data: Partial<Bundle>): Promise<Bundle> {
  // TODO: Implement database update
  const updateData: any = {
    shop: "",
    name: data?.name || "Name",
    type: data?.type || "single",
    products: data?.products || [],
    status: "draft",
    discountId: data?.discountId || "",
    discountType: data?.discountType || "",
    discountValue: parseInt(data?.discountValue, 10) || 0,
    stats: {
      visitors: 0,
      conversionRate: 0,
      bundlesRate: 0,
      aov: 0,
      addedRevenue: 0,
      totalRevenue: 0,
      revenuePerVisitor: 0,
      profitPerVisitor: 0,
    },
    settings: data.settings || {},
    updatedAt: new Date().toISOString(),
  };

  Object.keys(updateData).forEach(
    (key) => (updateData[key] == null) && delete updateData[key]
  );

  const result = await db.bundle.update({
    where: { id },
    data: updateData,
  });
  return result;
}

export async function deleteBundle(params: { id?: string, bundleId?: string }) {
  const { id, bundleId } = params;
  if (!id && !bundleId) {
    throw new Error("Must provide id or bundleId");
  }
  await db.bundle.deleteMany({
    where: {
      OR: [
        id ? { id } : undefined,
        bundleId ? { bundleId } : undefined,
      ].filter(Boolean) as any[],
    },
  });
}
