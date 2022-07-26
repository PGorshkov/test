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
    "sendMin" TEXT NOT NULL DEFAULT '0',
    "goalMin" TEXT NOT NULL DEFAULT '0'
);
INSERT INTO "new_Game" ("id", "leagueId", "leagueName", "matchAwayTeamId", "matchAwayTeamName", "matchDate", "matchHomeTeamId", "matchHomeTeamName", "matchId", "matchTime", "result", "sendChat", "sendMin") SELECT "id", "leagueId", "leagueName", "matchAwayTeamId", "matchAwayTeamName", "matchDate", "matchHomeTeamId", "matchHomeTeamName", "matchId", "matchTime", "result", "sendChat", coalesce("sendMin", '0') AS "sendMin" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
