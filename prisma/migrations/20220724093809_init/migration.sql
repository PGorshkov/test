/*
  Warnings:

  - Added the required column `countryName` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameType" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "leagueName" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchHomeTeamId" TEXT NOT NULL,
    "matchHomeTeamName" TEXT NOT NULL,
    "matchAwayTeamId" TEXT NOT NULL,
    "matchAwayTeamName" TEXT NOT NULL,
    "sendChat" INTEGER NOT NULL DEFAULT 0,
    "result" INTEGER NOT NULL DEFAULT 0,
    "sendMin" TEXT NOT NULL DEFAULT '0',
    "goalMin" TEXT NOT NULL DEFAULT '0',
    "countryName" TEXT NOT NULL
);
INSERT INTO "new_Game" ("gameType", "goalMin", "id", "leagueId", "leagueName", "matchAwayTeamId", "matchAwayTeamName", "matchHomeTeamId", "matchHomeTeamName", "matchId", "result", "sendChat", "sendMin") SELECT "gameType", "goalMin", "id", "leagueId", "leagueName", "matchAwayTeamId", "matchAwayTeamName", "matchHomeTeamId", "matchHomeTeamName", "matchId", "result", "sendChat", "sendMin" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
