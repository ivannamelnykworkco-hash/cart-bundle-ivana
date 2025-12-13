/*
  Warnings:

  - You are about to drop the `UpsellItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UpsellItem";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "QbUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qbId" TEXT,
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

-- CreateTable
CREATE TABLE "BxGyUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bxGyId" TEXT,
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

-- CreateTable
CREATE TABLE "BundleUpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buId" TEXT,
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BuyXGetY" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "buyQuantity" INTEGER NOT NULL,
    "getQuantity" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL,
    "badgeStyle" TEXT NOT NULL,
    "labelText" TEXT NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_BuyXGetY" ("badgeStyle", "badgeText", "bgColor", "bundleId", "buyQuantity", "createdAt", "getQuantity", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelText", "labelTitle", "opacity", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "buyQuantity", "createdAt", "getQuantity", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelText", "labelTitle", "opacity", "subtitle", "textColor", "title", "updatedAt" FROM "BuyXGetY";
DROP TABLE "BuyXGetY";
ALTER TABLE "new_BuyXGetY" RENAME TO "BuyXGetY";
CREATE TABLE "new_QuantityBreak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "badgeText" TEXT NOT NULL,
    "badgeStyle" TEXT NOT NULL,
    "labelText" TEXT NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_QuantityBreak" ("badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelText", "labelTitle", "opacity", "quantity", "selectPrice", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelText", "labelTitle", "opacity", "quantity", "selectPrice", "subtitle", "textColor", "title", "updatedAt" FROM "QuantityBreak";
DROP TABLE "QuantityBreak";
ALTER TABLE "new_QuantityBreak" RENAME TO "QuantityBreak";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
