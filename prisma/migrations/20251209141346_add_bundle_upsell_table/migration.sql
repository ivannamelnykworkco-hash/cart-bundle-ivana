/*
  Warnings:

  - You are about to alter the column `discountPrice` on the `ProductItem` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `quantity` on the `ProductItem` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "selectPrice" TEXT NOT NULL,
    "discountPrice" REAL,
    "selectedVariants" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "ProductItem_buId_fkey" FOREIGN KEY ("buId") REFERENCES "BundleUpsell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductItem" ("buId", "createdAt", "discountPrice", "id", "quantity", "selectPrice", "selectedVariants", "updatedAt") SELECT "buId", "createdAt", "discountPrice", "id", "quantity", "selectPrice", "selectedVariants", "updatedAt" FROM "ProductItem";
DROP TABLE "ProductItem";
ALTER TABLE "new_ProductItem" RENAME TO "ProductItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
