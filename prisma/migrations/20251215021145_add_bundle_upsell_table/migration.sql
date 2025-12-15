/*
  Warnings:

  - You are about to alter the column `base` on the `QbUpsellItem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.
  - You are about to alter the column `calc` on the `QbUpsellItem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QbUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qbId" TEXT NOT NULL,
    "isSelectedProduct" TEXT NOT NULL,
    "selectedVariants" TEXT NOT NULL,
    "selectedProduct" JSONB,
    "quantity" INTEGER NOT NULL,
    "base" DECIMAL NOT NULL DEFAULT 10.00,
    "calc" DECIMAL NOT NULL DEFAULT 20.00,
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
INSERT INTO "new_QbUpsellItem" ("base", "bgColor", "calc", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedProduct", "selectedVariants", "textColor", "updatedAt") SELECT "base", "bgColor", "calc", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedProduct", "selectedVariants", "textColor", "updatedAt" FROM "QbUpsellItem";
DROP TABLE "QbUpsellItem";
ALTER TABLE "new_QbUpsellItem" RENAME TO "QbUpsellItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
