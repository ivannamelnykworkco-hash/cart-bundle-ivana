-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CountdownTimer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isCountdown" BOOLEAN NOT NULL,
    "visibility" TEXT NOT NULL,
    "fixedDurationTime" INTEGER NOT NULL,
    "endDateTime" TEXT NOT NULL,
    "msgText" TEXT NOT NULL,
    "msgAlignment" INTEGER NOT NULL,
    "msgBold" BOOLEAN NOT NULL,
    "msgItalic" BOOLEAN NOT NULL,
    "msgSize" INTEGER NOT NULL,
    "msgBgColor" TEXT NOT NULL,
    "msgTextColor" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);
INSERT INTO "new_CountdownTimer" ("createdAt", "endDateTime", "fixedDurationTime", "id", "isCountdown", "msgAlignment", "msgBgColor", "msgBold", "msgItalic", "msgSize", "msgText", "msgTextColor", "visibility") SELECT "createdAt", "endDateTime", "fixedDurationTime", "id", "isCountdown", "msgAlignment", "msgBgColor", "msgBold", "msgItalic", "msgSize", "msgText", "msgTextColor", "visibility" FROM "CountdownTimer";
DROP TABLE "CountdownTimer";
ALTER TABLE "new_CountdownTimer" RENAME TO "CountdownTimer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
