/*
  Warnings:

  - You are about to drop the column `buId` on the `BundleUpsellItem` table. All the data in the column will be lost.
  - You are about to drop the column `bxGyId` on the `BxGyUpsellItem` table. All the data in the column will be lost.
  - You are about to drop the column `qbId` on the `QbUpsellItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BundleUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isSelectedProduct" TEXT NOT NULL,
    "selectedVariants" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "priceText" TEXT NOT NULL,
    "imageSize" INTEGER NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isVisibleOnly" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" REAL NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_BundleUpsellItem" ("bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt" FROM "BundleUpsellItem";
DROP TABLE "BundleUpsellItem";
ALTER TABLE "new_BundleUpsellItem" RENAME TO "BundleUpsellItem";
CREATE TABLE "new_BxGyUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isSelectedProduct" TEXT NOT NULL,
    "selectedVariants" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "priceText" TEXT NOT NULL,
    "imageSize" INTEGER NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isVisibleOnly" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" REAL NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_BxGyUpsellItem" ("bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt" FROM "BxGyUpsellItem";
DROP TABLE "BxGyUpsellItem";
ALTER TABLE "new_BxGyUpsellItem" RENAME TO "BxGyUpsellItem";
CREATE TABLE "new_QbUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isSelectedProduct" TEXT NOT NULL,
    "selectedVariants" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "priceText" TEXT NOT NULL,
    "imageSize" INTEGER NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isVisibleOnly" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" REAL NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_QbUpsellItem" ("bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt" FROM "QbUpsellItem";
DROP TABLE "QbUpsellItem";
ALTER TABLE "new_QbUpsellItem" RENAME TO "QbUpsellItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
