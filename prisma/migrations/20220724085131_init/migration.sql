/*
  Warnings:

  - You are about to drop the column `matchDate` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `matchTime` on the `Game` table. All the data in the column will be lost.

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
    "goalMin" TEXT NOT NULL DEFAULT '0'
);
INSERT INTO "new_Game" ("gameType", "goalMin", "id", "leagueId", "leagueName", "matchAwayTeamId", "matchAwayTeamName", "matchHomeTeamId", "matchHomeTeamName", "matchId", "result", "sendChat", "sendMin") SELECT "gameType", "goalMin", "id", "leagueId", "leagueName", "matchAwayTeamId", "matchAwayTeamName", "matchHomeTeamId", "matchHomeTeamName", "matchId", "result", "sendChat", "sendMin" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
