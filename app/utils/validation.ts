// app/utils/validation.ts
import type { BundleType } from "../models/types";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateBundleName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: "name", message: "Bundle name is required" };
  }
  if (name.length > 100) {
    return { field: "name", message: "Bundle name must be less than 100 characters" };
  }
  return null;
}

export function validatePrice(price: number | string): ValidationError | null {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { field: "price", message: "Price must be a valid number" };
  }
  if (numPrice < 0) {
    return { field: "price", message: "Price cannot be negative" };
  }
  if (numPrice > 999999) {
    return { field: "price", message: "Price is too large" };
  }
  return null;
}

export function validateDiscount(
  value: number,
  type: "percentage" | "fixed"
): ValidationError | null {
  if (type === "percentage") {
    if (value < 0 || value > 100) {
      return { field: "discount", message: "Percentage must be between 0 and 100" };
    }
  } else {
    if (value < 0) {
      return { field: "discount", message: "Discount cannot be negative" };
    }
  }
  return null;
}

export function validateBundleData(data: {
  name: string;
  type: BundleType;
  price?: number;
  discountValue?: number;
  discountType?: "percentage" | "fixed";
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateBundleName(data.name);
  if (nameError) errors.push(nameError);

  if (data.price !== undefined) {
    const priceError = validatePrice(data.price);
    if (priceError) errors.push(priceError);
  }

  if (data.discountValue !== undefined && data.discountType) {
    const discountError = validateDiscount(data.discountValue, data.discountType);
    if (discountError) errors.push(discountError);
  }

  return errors;
}