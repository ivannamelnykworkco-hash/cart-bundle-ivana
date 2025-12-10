/*
  Warnings:

  - You are about to alter the column `opacity` on the `BundleUpsell` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `opacity` on the `BuyXGetY` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `opacity` on the `QuantityBreak` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `productCounts` to the `BundleUpsell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectPrice` to the `BundleUpsell` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BundleUpsell" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "layoutOption" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL,
    "badgeStyle" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isShowQuantitySelector" BOOLEAN NOT NULL,
    "productCounts" INTEGER NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" REAL NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_BundleUpsell" ("badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "isShowQuantitySelector", "label", "labelSize", "labelTitle", "layoutOption", "opacity", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "isShowQuantitySelector", "label", "labelSize", "labelTitle", "layoutOption", "opacity", "subtitle", "textColor", "title", "updatedAt" FROM "BundleUpsell";
DROP TABLE "BundleUpsell";
ALTER TABLE "new_BundleUpsell" RENAME TO "BundleUpsell";
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
    "label" TEXT NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" REAL NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_BuyXGetY" ("badgeStyle", "badgeText", "bgColor", "bundleId", "buyQuantity", "createdAt", "getQuantity", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "label", "labelSize", "labelTitle", "opacity", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "buyQuantity", "createdAt", "getQuantity", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "label", "labelSize", "labelTitle", "opacity", "subtitle", "textColor", "title", "updatedAt" FROM "BuyXGetY";
DROP TABLE "BuyXGetY";
ALTER TABLE "new_BuyXGetY" RENAME TO "BuyXGetY";
CREATE TABLE "new_ProductItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buId" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" TEXT,
    "variant" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "ProductItem_buId_fkey" FOREIGN KEY ("buId") REFERENCES "BundleUpsell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductItem" ("buId", "createdAt", "discountPrice", "id", "quantity", "selectPrice", "updatedAt", "variant") SELECT "buId", "createdAt", "discountPrice", "id", "quantity", "selectPrice", "updatedAt", "variant" FROM "ProductItem";
DROP TABLE "ProductItem";
ALTER TABLE "new_ProductItem" RENAME TO "ProductItem";
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
    "label" TEXT NOT NULL,
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" REAL NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_QuantityBreak" ("badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "label", "labelSize", "labelTitle", "opacity", "quantity", "selectPrice", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "label", "labelSize", "labelTitle", "opacity", "quantity", "selectPrice", "subtitle", "textColor", "title", "updatedAt" FROM "QuantityBreak";
DROP TABLE "QuantityBreak";
ALTER TABLE "new_QuantityBreak" RENAME TO "QuantityBreak";
CREATE TABLE "new_UpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qbId" TEXT,
    "bxGyId" TEXT,
    "buId" TEXT,
    "isSelectedProduct" BOOLEAN NOT NULL,
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
