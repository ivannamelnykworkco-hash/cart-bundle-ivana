/*
  Warnings:

  - You are about to drop the column `variant` on the `ProductItem` table. All the data in the column will be lost.
  - Added the required column `selectedVariants` to the `ProductItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedVariants` to the `UpsellItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buId" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" TEXT,
    "selectedVariants" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "ProductItem_buId_fkey" FOREIGN KEY ("buId") REFERENCES "BundleUpsell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductItem" ("buId", "createdAt", "discountPrice", "id", "quantity", "selectPrice", "updatedAt") SELECT "buId", "createdAt", "discountPrice", "id", "quantity", "selectPrice", "updatedAt" FROM "ProductItem";
DROP TABLE "ProductItem";
ALTER TABLE "new_ProductItem" RENAME TO "ProductItem";
CREATE TABLE "new_UpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qbId" TEXT,
    "bxGyId" TEXT,
    "buId" TEXT,
    "isSelectedProduct" BOOLEAN NOT NULL,
    "selectedVariants" TEXT NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "priceText" TEXT NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isVisibleOnly" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "UpsellItem_qbId_fkey" FOREIGN KEY ("qbId") REFERENCES "QuantityBreak" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpsellItem_bxGyId_fkey" FOREIGN KEY ("bxGyId") REFERENCES "BuyXGetY" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpsellItem_buId_fkey" FOREIGN KEY ("buId") REFERENCES "BundleUpsell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UpsellItem" ("bgColor", "buId", "bxGyId", "createdAt", "discountPrice", "id", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "selectPrice", "textColor", "updatedAt") SELECT "bgColor", "buId", "bxGyId", "createdAt", "discountPrice", "id", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "selectPrice", "textColor", "updatedAt" FROM "UpsellItem";
DROP TABLE "UpsellItem";
ALTER TABLE "new_UpsellItem" RENAME TO "UpsellItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
