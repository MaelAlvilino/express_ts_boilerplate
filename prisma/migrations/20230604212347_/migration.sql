/*
  Warnings:

  - Added the required column `postalCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "street" TEXT,
    "neighborhood" TEXT,
    "address" TEXT,
    "state" TEXT
);
INSERT INTO "new_User" ("email", "id", "login", "name", "password") SELECT "email", "id", "login", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
