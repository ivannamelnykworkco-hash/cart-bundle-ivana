// app/models/analytics.server.ts
import type { Analytics } from "./types";

export async function getAnalytics(shopId: string): Promise<Analytics> {
  // TODO: Implement database query
  return {
    thisMonthRevenue: 0,
    allTimeRevenue: 0,
    resetDate: getFirstDayOfNextMonth(),
  };
}

export async function trackBundleView(bundleId: string, shopId: string): Promise<void> {
  // TODO: Implement analytics tracking
}

export async function trackBundlePurchase(
  bundleId: string,
  revenue: number,
  shopId: string
): Promise<void> {
  // TODO: Implement purchase tracking
}

function getFirstDayOfNextMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}