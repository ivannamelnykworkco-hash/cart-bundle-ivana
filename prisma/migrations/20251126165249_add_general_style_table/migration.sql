/*
  Warnings:

  - You are about to drop the column `colorSwatch` on the `GeneralSetting` table. All the data in the column will be lost.
  - You are about to drop the column `imageSwatch` on the `GeneralSetting` table. All the data in the column will be lost.
  - Added the required column `colorSwatchArray` to the `GeneralSetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageSwatchArray` to the `GeneralSetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markets` to the `GeneralSetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `GeneralSetting` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GeneralStyle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "cornerRadius" INTEGER NOT NULL,
    "spacing" INTEGER NOT NULL,
    "cardsBgColor" TEXT NOT NULL,
    "blockTitleColor" TEXT NOT NULL,
    "barTitleColor" TEXT NOT NULL,
    "barSubTitleColor" TEXT NOT NULL,
    "barPriceColor" TEXT NOT NULL,
    "barFullPriceColor" TEXT NOT NULL,
    "barLabelBack" TEXT NOT NULL,
    "barLabelTextColor" TEXT NOT NULL,
    "barBadgebackColor" TEXT NOT NULL,
    "barBadgeTextColor" TEXT NOT NULL,
    "barUpsellBackColor" TEXT NOT NULL,
    "barUpsellTextColor" TEXT NOT NULL,
    "barBlocktitle" INTEGER NOT NULL,
    "barBlocktitleFontStyle" TEXT NOT NULL,
    "bartitleSize" INTEGER NOT NULL,
    "bartitleFontStyle" TEXT NOT NULL,
    "subTitleSize" INTEGER NOT NULL,
    "subTitleStyle" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "labelStyle" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneralSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleName" TEXT NOT NULL,
    "discountName" TEXT NOT NULL,
    "blockTitle" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "markets" TEXT NOT NULL,
    "excludedProducts" TEXT NOT NULL,
    "excludedCollections" TEXT NOT NULL,
    "selectedProducts" TEXT NOT NULL,
    "selectedCollections" TEXT NOT NULL,
    "excludeB2B" BOOLEAN NOT NULL,
    "excludePOS" BOOLEAN NOT NULL,
    "startDateTime" TEXT NOT NULL,
    "setEndDate" BOOLEAN NOT NULL,
    "endDateTime" TEXT NOT NULL,
    "letCustomer" BOOLEAN NOT NULL,
    "showVariant" BOOLEAN NOT NULL,
    "hideTheme" BOOLEAN NOT NULL,
    "colorSwatchArray" TEXT NOT NULL,
    "imageSwatchArray" TEXT NOT NULL,
    "swatchSize" TEXT NOT NULL,
    "swatchShape" TEXT NOT NULL,
    "setDefaultVariant" TEXT NOT NULL,
    "showPrices" BOOLEAN NOT NULL,
    "showBothPrices" BOOLEAN NOT NULL,
    "unitLabel" TEXT NOT NULL,
    "useProductCompare" BOOLEAN NOT NULL,
    "showPricesWithout" BOOLEAN NOT NULL,
    "priceRounding" TEXT NOT NULL,
    "updateTheme" TEXT NOT NULL,
    "skipCart" BOOLEAN NOT NULL,
    "showWhenStock" INTEGER NOT NULL,
    "msgText" TEXT NOT NULL,
    "msgColor" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_GeneralSetting" ("blockTitle", "bundleName", "createdAt", "discountName", "endDateTime", "excludeB2B", "excludePOS", "excludedCollections", "excludedProducts", "hideTheme", "id", "letCustomer", "msgColor", "msgText", "priceRounding", "selectedCollections", "selectedProducts", "setDefaultVariant", "setEndDate", "showBothPrices", "showPrices", "showPricesWithout", "showVariant", "showWhenStock", "skipCart", "startDateTime", "swatchShape", "swatchSize", "unitLabel", "updateTheme", "updatedAt", "useProductCompare") SELECT "blockTitle", "bundleName", "createdAt", "discountName", "endDateTime", "excludeB2B", "excludePOS", "excludedCollections", "excludedProducts", "hideTheme", "id", "letCustomer", "msgColor", "msgText", "priceRounding", "selectedCollections", "selectedProducts", "setDefaultVariant", "setEndDate", "showBothPrices", "showPrices", "showPricesWithout", "showVariant", "showWhenStock", "skipCart", "startDateTime", "swatchShape", "swatchSize", "unitLabel", "updateTheme", "updatedAt", "useProductCompare" FROM "GeneralSetting";
DROP TABLE "GeneralSetting";
ALTER TABLE "new_GeneralSetting" RENAME TO "GeneralSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
