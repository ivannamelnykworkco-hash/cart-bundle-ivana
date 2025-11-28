-- CreateTable
CREATE TABLE "VolumeDiscount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "layoutImageUrl" TEXT NOT NULL,
    "layoutButtonText" TEXT NOT NULL,
    "layoutColor" TEXT NOT NULL,
    "productPhotoSize" INTEGER NOT NULL,
    "showProductName" BOOLEAN NOT NULL,
    "showPrice" BOOLEAN NOT NULL,
    "customButtonSize" INTEGER NOT NULL,
    "customTextSize" INTEGER NOT NULL,
    "customOverlayColor" TEXT NOT NULL,
    "customPriceColor" TEXT NOT NULL,
    "customCompareAtPriceColor" TEXT NOT NULL,
    "customTextColor" TEXT NOT NULL,
    "customButtonColor" TEXT NOT NULL,
    "customButtonTextColor" TEXT NOT NULL,
    "customHeadingText" TEXT NOT NULL,
    "customMessageText" TEXT NOT NULL,
    "customButtonText" TEXT NOT NULL,
    "customPhotoSize" INTEGER NOT NULL
);
