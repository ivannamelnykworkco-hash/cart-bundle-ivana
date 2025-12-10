-- CreateTable
CREATE TABLE "QuantityBreak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "quantity" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL NOT NULL,
    "badgeText" TEXT NOT NULL,
    "badgeStyle" TEXT NOT NULL,
    "label" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "BuyXGetY" (
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
    "opacity" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BundleUpsell" (
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
    "isShowAsSoldOut" BOOLEAN NOT NULL,
    "labelTitle" TEXT NOT NULL,
    "opacity" INTEGER NOT NULL,
    "bgColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "labelSize" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qbId" TEXT NOT NULL,
    "bxGyId" TEXT NOT NULL,
    "buId" TEXT NOT NULL,
    "isSelectedProduct" BOOLEAN NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL NOT NULL,
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

-- CreateTable
CREATE TABLE "ProductItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buId" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "ProductItem_buId_fkey" FOREIGN KEY ("buId") REFERENCES "BundleUpsell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
