/*
  Warnings:

  - You are about to drop the column `league_id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `league_name` on the `Game` table. All the data in the column will be lost.
  - Added the required column `leagueId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueName` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leagueId" TEXT NOT NULL,
    "leagueName" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchHomeTeamId" TEXT NOT NULL,
    "matchHomeTeamName" TEXT NOT NULL,
    "matchAwayTeamId" TEXT NOT NULL,
    "matchAwayTeamName" TEXT NOT NULL,
    "matchDate" TEXT NOT NULL,
    "matchTime" TEXT NOT NULL,
    "sendChat" INTEGER NOT NULL DEFAULT 0,
    "result" INTEGER NOT NULL DEFAULT 0,
    "sendMin" TEXT
);
INSERT INTO "new_Game" ("id", "matchAwayTeamId", "matchAwayTeamName", "matchDate", "matchHomeTeamId", "matchHomeTeamName", "matchId", "matchTime", "result", "sendChat") SELECT "id", "matchAwayTeamId", "matchAwayTeamName", "matchDate", "matchHomeTeamId", "matchHomeTeamName", "matchId", "matchTime", "result", "sendChat" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
