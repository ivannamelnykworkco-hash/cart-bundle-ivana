/*
  Warnings:

  - You are about to drop the column `barLabelBack` on the `GeneralStyle` table. All the data in the column will be lost.
  - Added the required column `barLabelBackColor` to the `GeneralStyle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barUpsellSelectedBackColor` to the `GeneralStyle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barUpsellSelectedTextColor` to the `GeneralStyle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borderColor` to the `GeneralStyle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedBgColor` to the `GeneralStyle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneralStyle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "cornerRadius" INTEGER NOT NULL,
    "spacing" INTEGER NOT NULL,
    "cardsBgColor" TEXT NOT NULL,
    "selectedBgColor" TEXT NOT NULL,
    "borderColor" TEXT NOT NULL,
    "blockTitleColor" TEXT NOT NULL,
    "barTitleColor" TEXT NOT NULL,
    "barSubTitleColor" TEXT NOT NULL,
    "barPriceColor" TEXT NOT NULL,
    "barFullPriceColor" TEXT NOT NULL,
    "barLabelBackColor" TEXT NOT NULL,
    "barLabelTextColor" TEXT NOT NULL,
    "barBadgebackColor" TEXT NOT NULL,
    "barBadgeTextColor" TEXT NOT NULL,
    "barUpsellBackColor" TEXT NOT NULL,
    "barUpsellTextColor" TEXT NOT NULL,
    "barUpsellSelectedBackColor" TEXT NOT NULL,
    "barUpsellSelectedTextColor" TEXT NOT NULL,
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
INSERT INTO "new_GeneralStyle" ("barBadgeTextColor", "barBadgebackColor", "barBlocktitle", "barBlocktitleFontStyle", "barFullPriceColor", "barLabelTextColor", "barPriceColor", "barSubTitleColor", "barTitleColor", "barUpsellBackColor", "barUpsellTextColor", "bartitleFontStyle", "bartitleSize", "blockTitleColor", "bundleId", "cardsBgColor", "cornerRadius", "createdAt", "id", "labelSize", "labelStyle", "spacing", "subTitleSize", "subTitleStyle", "updatedAt") SELECT "barBadgeTextColor", "barBadgebackColor", "barBlocktitle", "barBlocktitleFontStyle", "barFullPriceColor", "barLabelTextColor", "barPriceColor", "barSubTitleColor", "barTitleColor", "barUpsellBackColor", "barUpsellTextColor", "bartitleFontStyle", "bartitleSize", "blockTitleColor", "bundleId", "cardsBgColor", "cornerRadius", "createdAt", "id", "labelSize", "labelStyle", "spacing", "subTitleSize", "subTitleStyle", "updatedAt" FROM "GeneralStyle";
DROP TABLE "GeneralStyle";
ALTER TABLE "new_GeneralStyle" RENAME TO "GeneralStyle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
