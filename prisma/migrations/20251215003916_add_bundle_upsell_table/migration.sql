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
    "base" INTEGER NOT NULL DEFAULT 10,
    "calc" INTEGER NOT NULL DEFAULT 20,
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
INSERT INTO "new_QbUpsellItem" ("bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedProduct", "selectedVariants", "textColor", "updatedAt") SELECT "bgColor", "createdAt", "discountPrice", "id", "imageSize", "isSelectedByDefault", "isSelectedProduct", "isShowAsSoldOut", "isVisibleOnly", "labelSize", "labelTitle", "opacity", "priceText", "qbId", "quantity", "selectPrice", "selectedProduct", "selectedVariants", "textColor", "updatedAt" FROM "QbUpsellItem";
DROP TABLE "QbUpsellItem";
ALTER TABLE "new_QbUpsellItem" RENAME TO "QbUpsellItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
