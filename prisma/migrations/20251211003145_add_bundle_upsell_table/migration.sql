/*
  Warnings:

  - You are about to drop the column `label` on the `BundleUpsell` table. All the data in the column will be lost.
  - You are about to alter the column `opacity` on the `BundleUpsell` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to drop the column `label` on the `BuyXGetY` table. All the data in the column will be lost.
  - You are about to alter the column `opacity` on the `BuyXGetY` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to drop the column `label` on the `QuantityBreak` table. All the data in the column will be lost.
  - You are about to alter the column `opacity` on the `QuantityBreak` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

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
    "labelText" TEXT NOT NULL DEFAULT '',
    "isSelectedByDefault" BOOLEAN NOT NULL,
    "isShowQuantitySelector" BOOLEAN NOT NULL,
    "productCounts" INTEGER NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_BundleUpsell" ("badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "isShowQuantitySelector", "labelSize", "labelTitle", "layoutOption", "opacity", "productCounts", "selectPrice", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "isShowQuantitySelector", "labelSize", "labelTitle", "layoutOption", "opacity", "productCounts", "selectPrice", "subtitle", "textColor", "title", "updatedAt" FROM "BundleUpsell";
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
    "labelText" TEXT NOT NULL DEFAULT '',
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
INSERT INTO "new_BuyXGetY" ("badgeStyle", "badgeText", "bgColor", "bundleId", "buyQuantity", "createdAt", "getQuantity", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelTitle", "opacity", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "buyQuantity", "createdAt", "getQuantity", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelTitle", "opacity", "subtitle", "textColor", "title", "updatedAt" FROM "BuyXGetY";
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
    "labelText" TEXT NOT NULL DEFAULT '',
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
INSERT INTO "new_QuantityBreak" ("badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelTitle", "opacity", "quantity", "selectPrice", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "labelSize", "labelTitle", "opacity", "quantity", "selectPrice", "subtitle", "textColor", "title", "updatedAt" FROM "QuantityBreak";
DROP TABLE "QuantityBreak";
ALTER TABLE "new_QuantityBreak" RENAME TO "QuantityBreak";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
