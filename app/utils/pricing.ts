// app/utils/pricing.ts

export function calculateSavings(originalPrice: number, discountedPrice: number): {
  amount: number;
  percentage: number;
} {
  const amount = originalPrice - discountedPrice;
  const percentage = (amount / originalPrice) * 100;
  
  return {
    amount: parseFloat(amount.toFixed(2)),
    percentage: parseFloat(percentage.toFixed(0)),
  };
}

export function applyDiscount(
  price: number,
  discountValue: number,
  discountType: "percentage" | "fixed"
): number {
  if (discountType === "percentage") {
    return price * (1 - discountValue / 100);
  }
  return price - discountValue;
}

export function calculateBundlePrice(
  products: Array<{ price: number }>,
  discountValue: number,
  discountType: "percentage" | "fixed"
): number {
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  return applyDiscount(totalPrice, discountValue, discountType);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}