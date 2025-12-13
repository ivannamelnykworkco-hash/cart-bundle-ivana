/*
  Warnings:

  - Made the column `buId` on table `BundleUpsellItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bxGyId` on table `BxGyUpsellItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qbId` on table `QbUpsellItem` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BundleUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buId" TEXT NOT NULL,
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
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "BundleUpsellItem_buId_fkey" FOREIGN KEY ("buId") REFERENCES "BundleUpsell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BundleUpsellItem" ("bgColor", "buId", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "buId", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt" FROM "BundleUpsellItem";
DROP TABLE "BundleUpsellItem";
ALTER TABLE "new_BundleUpsellItem" RENAME TO "BundleUpsellItem";
CREATE TABLE "new_BxGyUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bxGyId" TEXT NOT NULL,
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
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "BxGyUpsellItem_bxGyId_fkey" FOREIGN KEY ("bxGyId") REFERENCES "BuyXGetY" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BxGyUpsellItem" ("bgColor", "bxGyId", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "bxGyId", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt" FROM "BxGyUpsellItem";
DROP TABLE "BxGyUpsellItem";
ALTER TABLE "new_BxGyUpsellItem" RENAME TO "BxGyUpsellItem";
CREATE TABLE "new_QbUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qbId" TEXT NOT NULL,
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
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "QbUpsellItem_qbId_fkey" FOREIGN KEY ("qbId") REFERENCES "QuantityBreak" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QbUpsellItem" ("bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt" FROM "QbUpsellItem";
DROP TABLE "QbUpsellItem";
ALTER TABLE "new_QbUpsellItem" RENAME TO "QbUpsellItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
