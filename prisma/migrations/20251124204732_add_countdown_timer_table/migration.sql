-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "products" JSONB NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" REAL NOT NULL,
    "stats" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "thisMonthRevenue" REAL NOT NULL DEFAULT 0,
    "allTimeRevenue" REAL NOT NULL DEFAULT 0,
    "lastResetDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BundleView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BundlePurchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "revenue" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GeneralSetting" (
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
    "startDateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setEndDate" BOOLEAN NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "endDateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CountdownTimer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isCountdown" BOOLEAN NOT NULL,
    "visibility" TEXT NOT NULL,
    "fixedDurationTime" INTEGER NOT NULL,
    "endDateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "msgText" TEXT NOT NULL,
    "msgAlignment" INTEGER NOT NULL,
    "msgBold" BOOLEAN NOT NULL,
    "msgItalic" BOOLEAN NOT NULL,
    "msgSize" INTEGER NOT NULL,
    "msgBgColor" TEXT NOT NULL,
    "msgTextColor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Bundle_shop_idx" ON "Bundle"("shop");

-- CreateIndex
CREATE INDEX "Bundle_status_idx" ON "Bundle"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_shop_key" ON "Analytics"("shop");

-- CreateIndex
CREATE INDEX "BundleView_bundleId_idx" ON "BundleView"("bundleId");

-- CreateIndex
CREATE INDEX "BundleView_shop_idx" ON "BundleView"("shop");

-- CreateIndex
CREATE INDEX "BundlePurchase_bundleId_idx" ON "BundlePurchase"("bundleId");

-- CreateIndex
CREATE INDEX "BundlePurchase_shop_idx" ON "BundlePurchase"("shop");
