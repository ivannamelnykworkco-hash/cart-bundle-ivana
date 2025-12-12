-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UpsellItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qbId" TEXT,
    "bxGyId" TEXT,
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
    CONSTRAINT "UpsellItem_qbId_fkey" FOREIGN KEY ("qbId") REFERENCES "QuantityBreak" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpsellItem_bxGyId_fkey" FOREIGN KEY ("bxGyId") REFERENCES "BuyXGetY" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpsellItem_buId_fkey" FOREIGN KEY ("buId") REFERENCES "BundleUpsell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UpsellItem" ("bgColor", "buId", "bxGyId", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "buId", "bxGyId", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedVariants", "textColor", "updatedAt" FROM "UpsellItem";
DROP TABLE "UpsellItem";
ALTER TABLE "new_UpsellItem" RENAME TO "UpsellItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
