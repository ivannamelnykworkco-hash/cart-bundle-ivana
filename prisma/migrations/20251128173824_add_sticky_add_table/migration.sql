-- CreateTable
CREATE TABLE "StickyAdd" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "contentTitleText" TEXT NOT NULL,
    "contentButtonText" TEXT NOT NULL,
    "styleBgColor" TEXT NOT NULL,
    "styleTitleColor" TEXT NOT NULL,
    "styleButtonColor" TEXT NOT NULL,
    "styleButtonTextColor" TEXT NOT NULL,
    "styleTitleFontSize" INTEGER NOT NULL,
    "styleTitleFontStyle" TEXT NOT NULL,
    "styleButtonFontSize" INTEGER NOT NULL,
    "styleButtonFontStyle" TEXT NOT NULL,
    "stylePhotoSize" INTEGER NOT NULL,
    "stylePhotoCornerRadius" INTEGER NOT NULL,
    "styleButtonPadding" INTEGER NOT NULL,
    "styleButtonCornerRadius" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);
