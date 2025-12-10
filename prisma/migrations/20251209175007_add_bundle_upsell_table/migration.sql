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
    "labelSize" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
INSERT INTO "new_BundleUpsell" ("badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "isShowQuantitySelector", "label", "labelSize", "labelTitle", "layoutOption", "opacity", "productCounts", "selectPrice", "subtitle", "textColor", "title", "updatedAt") SELECT "badgeStyle", "badgeText", "bgColor", "bundleId", "createdAt", "discountPrice", "id", "isOpen", "isSelectedByDefault", "isShowAsSoldOut", "isShowQuantitySelector", "label", "labelSize", "labelTitle", "layoutOption", "opacity", "productCounts", "selectPrice", "subtitle", "textColor", "title", "updatedAt" FROM "BundleUpsell";
DROP TABLE "BundleUpsell";
ALTER TABLE "new_BundleUpsell" RENAME TO "BundleUpsell";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
