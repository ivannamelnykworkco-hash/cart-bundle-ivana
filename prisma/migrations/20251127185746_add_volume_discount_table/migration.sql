/*
  Warnings:

  - Added the required column `createdAt` to the `VolumeDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VolumeDiscount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VolumeDiscount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "layoutImageUrl" TEXT NOT NULL,
    "layoutButtonText" TEXT NOT NULL,
    "layoutColor" TEXT NOT NULL,
    "productPhotoSize" INTEGER NOT NULL,
    "showProductName" BOOLEAN NOT NULL,
    "showPrice" BOOLEAN NOT NULL,
    "customButtonSize" INTEGER NOT NULL,
    "customTextSize" INTEGER NOT NULL,
    "customOverlayColor" TEXT NOT NULL,
    "customPriceColor" TEXT NOT NULL,
    "customCompareAtPriceColor" TEXT NOT NULL,
    "customTextColor" TEXT NOT NULL,
    "customButtonColor" TEXT NOT NULL,
    "customButtonTextColor" TEXT NOT NULL,
    "customHeadingText" TEXT NOT NULL,
    "customMessageText" TEXT NOT NULL,
    "customButtonText" TEXT NOT NULL,
    "customPhotoSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_VolumeDiscount" ("bundleId", "customButtonColor", "customButtonSize", "customButtonText", "customButtonTextColor", "customCompareAtPriceColor", "customHeadingText", "customMessageText", "customOverlayColor", "customPhotoSize", "customPriceColor", "customTextColor", "customTextSize", "id", "layoutButtonText", "layoutColor", "layoutImageUrl", "productPhotoSize", "showPrice", "showProductName", "visibility") SELECT "bundleId", "customButtonColor", "customButtonSize", "customButtonText", "customButtonTextColor", "customCompareAtPriceColor", "customHeadingText", "customMessageText", "customOverlayColor", "customPhotoSize", "customPriceColor", "customTextColor", "customTextSize", "id", "layoutButtonText", "layoutColor", "layoutImageUrl", "productPhotoSize", "showPrice", "showProductName", "visibility" FROM "VolumeDiscount";
DROP TABLE "VolumeDiscount";
ALTER TABLE "new_VolumeDiscount" RENAME TO "VolumeDiscount";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
