-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneralSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleName" TEXT NOT NULL,
    "discountName" TEXT NOT NULL,
    "blockTitle" TEXT NOT NULL,
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
    "colorSwatch" TEXT NOT NULL,
    "imageSwatch" TEXT NOT NULL,
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
INSERT INTO "new_GeneralSetting" ("blockTitle", "bundleName", "colorSwatch", "createdAt", "discountName", "endDateTime", "excludeB2B", "excludePOS", "excludedCollections", "excludedProducts", "hideTheme", "id", "imageSwatch", "letCustomer", "msgColor", "msgText", "priceRounding", "selectedCollections", "selectedProducts", "setDefaultVariant", "setEndDate", "showBothPrices", "showPrices", "showPricesWithout", "showVariant", "showWhenStock", "skipCart", "startDateTime", "swatchShape", "swatchSize", "unitLabel", "updateTheme", "updatedAt", "useProductCompare") SELECT "blockTitle", "bundleName", "colorSwatch", "createdAt", "discountName", "endDateTime", "excludeB2B", "excludePOS", "excludedCollections", "excludedProducts", "hideTheme", "id", "imageSwatch", "letCustomer", "msgColor", "msgText", "priceRounding", "selectedCollections", "selectedProducts", "setDefaultVariant", "setEndDate", "showBothPrices", "showPrices", "showPricesWithout", "showVariant", "showWhenStock", "skipCart", "startDateTime", "swatchShape", "swatchSize", "unitLabel", "updateTheme", "updatedAt", "useProductCompare" FROM "GeneralSetting";
DROP TABLE "GeneralSetting";
ALTER TABLE "new_GeneralSetting" RENAME TO "GeneralSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
