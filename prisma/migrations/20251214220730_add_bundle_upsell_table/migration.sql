/*
  Warnings:

  - You are about to alter the column `setDefaultVariant` on the `GeneralSetting` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneralSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
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
    "swatchOption" TEXT NOT NULL,
    "swatchType" TEXT NOT NULL,
    "swatchSize" INTEGER NOT NULL,
    "swatchShape" TEXT NOT NULL,
    "setDefaultVariant" JSONB NOT NULL,
    "showPrices" BOOLEAN NOT NULL,
    "showBothPrices" BOOLEAN NOT NULL,
    "unitLabel" TEXT NOT NULL,
    "useProductCompare" BOOLEAN NOT NULL,
    "showPricesWithout" BOOLEAN NOT NULL,
    "showPriceRounding" BOOLEAN NOT NULL,
    "priceRounding" TEXT NOT NULL,
    "updateTheme" BOOLEAN NOT NULL,
    "priceSelect" TEXT NOT NULL,
    "skipCart" BOOLEAN NOT NULL,
    "showAlert" BOOLEAN NOT NULL,
    "showWhenStock" INTEGER NOT NULL,
    "msgText" TEXT NOT NULL,
    "msgColor" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_GeneralSetting" ("blockTitle", "bundleId", "bundleName", "colorSwatchArray", "createdAt", "discountId", "discountName", "endDateTime", "excludeB2B", "excludePOS", "excludedCollections", "excludedProducts", "hideTheme", "id", "imageSwatchArray", "letCustomer", "markets", "msgColor", "msgText", "priceRounding", "priceSelect", "selectedCollections", "selectedProducts", "setDefaultVariant", "setEndDate", "showAlert", "showBothPrices", "showPriceRounding", "showPrices", "showPricesWithout", "showVariant", "showWhenStock", "skipCart", "startDateTime", "swatchOption", "swatchShape", "swatchSize", "swatchType", "unitLabel", "updateTheme", "updatedAt", "useProductCompare", "visibility") SELECT "blockTitle", "bundleId", "bundleName", "colorSwatchArray", "createdAt", "discountId", "discountName", "endDateTime", "excludeB2B", "excludePOS", "excludedCollections", "excludedProducts", "hideTheme", "id", "imageSwatchArray", "letCustomer", "markets", "msgColor", "msgText", "priceRounding", "priceSelect", "selectedCollections", "selectedProducts", "setDefaultVariant", "setEndDate", "showAlert", "showBothPrices", "showPriceRounding", "showPrices", "showPricesWithout", "showVariant", "showWhenStock", "skipCart", "startDateTime", "swatchOption", "swatchShape", "swatchSize", "swatchType", "unitLabel", "updateTheme", "updatedAt", "useProductCompare", "visibility" FROM "GeneralSetting";
DROP TABLE "GeneralSetting";
ALTER TABLE "new_GeneralSetting" RENAME TO "GeneralSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
