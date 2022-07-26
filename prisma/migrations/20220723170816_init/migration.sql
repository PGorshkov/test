-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "league_id" TEXT NOT NULL,
    "league_name" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchHomeTeamId" TEXT NOT NULL,
    "matchHomeTeamName" TEXT NOT NULL,
    "matchAwayTeamId" TEXT NOT NULL,
    "matchAwayTeamName" TEXT NOT NULL,
    "matchDate" TEXT NOT NULL,
    "matchTime" TEXT NOT NULL,
    "sendChat" INTEGER NOT NULL DEFAULT 0,
    "result" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "messageId" TEXT NOT NULL,
    CONSTRAINT "Chat_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_gameId_key" ON "Chat"("gameId");
