import {getMatchTeam} from "../service/game";
import {PrismaClient} from "@prisma/client";

const idChat = 187067603
import { Telegraf } from 'telegraf'

const bot = new Telegraf('5266091556:AAGdTRPLUah5s-_JnQGfXWH9YES1z0PJlxI')

const prisma = new PrismaClient()

const gameType = 'GOAL_FIRST_TIME';

// Подсчет процент голов в первом тайме
function checkGoal(matches: {[key: string]: any}[] = [], teamId: string, isHome: boolean, leagueYear: string) {
    if (!Array.isArray(matches)) return 0
    // отбираем игры по позиции на текущий матч
    // @ts-ignore
    //&& el.league_year === leagueYear
    const matchesTeam = matches
        .filter((el: any) => {
        if(isHome) {
            return el.match_hometeam_id === teamId
        } else {
            return el.match_awayteam_id === teamId
        }
    })
    console.log('matchesTeam', matchesTeam.length, matches.length)
    if (matchesTeam.length < 5) return 0
    // забили
    let goal = 0;
    // пропустили
    let missed = 0;
    for(let i = 0; i < matchesTeam.length; i++) {
        // Находим голы первого матча
        const goalscorer = matches[i].goalscorer.filter((el: any) => {
            return el.score_info_time === '1st Half' && el.info !== 'Penalty'
        })
        // Проверяем на голы
        if (goalscorer.length > 0) {
            const res = goalscorer[goalscorer.length - 1].score.split(' - ').map((el: any) => parseInt(el))
            goal += res[isHome ? 0 : 1]
            missed += res[isHome ? 1 : 0]
        }
    }
    // console.log('predict', goal / matches.length * 100 + missed / matches.length * 100)
    return (goal / matches.length * 100) + (missed / matches.length * 100)
}
// поиск подходящих матчей
export async function initMatch (matches: {[key: string]: any}[]) {
    const initMatches = matches
        .filter((el: any) => {
            return el.league_year !== '' && el.league_id !== '0' && el.match_time > '08:00'
        })
    console.log('matches', initMatches.length)
    for(let i = 0; i < initMatches.length; i++) {
        const match = initMatches[i]
        const games = await prisma.game.findFirst({
            where: {
                gameType,
                matchId: match.match_id
            }
        })
        if (
            !games
            && (parseInt(match.match_status) > 0 && parseInt(match.match_status) < 10)
            && (match.match_hometeam_halftime_score === '0' && match.match_awayteam_halftime_score === '0')
        ) {
            // определяем матчи для сигнала
            const home = await getMatchTeam(match.match_hometeam_id, match.league_id)
            const away = await getMatchTeam(match.match_awayteam_id, match.league_id)

            const homePredict = checkGoal(home, match.match_hometeam_id, true, match.league_year)
            const awayPredict = checkGoal(away, match.match_awayteam_id, false, match.league_year)

            const data = {
                gameType,
                dateMatch: match.match_date,
                leagueId: match.league_id,
                leagueName: match.league_name,
                countryName: match.country_name,
                matchId: match.match_id,
                matchHomeTeamId: match.match_hometeam_id,
                matchHomeTeamName: match.match_hometeam_name,
                matchAwayTeamId: match.match_awayteam_id,
                matchAwayTeamName: match.match_awayteam_name,
            }

            if (awayPredict + homePredict > 80) {
                try{
                    console.log('YES SIGNAL', match.match_id)
                    await bot.telegram.sendMessage(idChat, `${data.countryName}\n${data.leagueName}\n${data.matchHomeTeamName}-${data.matchAwayTeamName}\n predict - ${awayPredict + homePredict}`)
                    // console.log('predict', awayPredict + homePredict, 1)
                    // console.log(match.match_id, match.match_status, home.length, away.length, awayPredict + homePredict)
                    await prisma.game.create({
                        data: {
                            ...data,
                            result: 1
                        }
                    })
                } catch (e) {
                    console.log('predict error', e)
                }
            } else {
                try{

                    // Записываем матч с result = 0
                    // console.log('predict', awayPredict + homePredict, 0)
                    // await bot.telegram.sendMessage(idChat, `${data.countryName}\n${data.leagueName}\n${data.matchHomeTeamName}-${data.matchAwayTeamName}\n predict - ${awayPredict + homePredict}`)
                    await prisma.game.create({
                        data: {
                            ...data,
                            result: 0
                        }
                    })
                } catch {}
            }
        }
    }
}
// проверка отобранных матчей для сигнала
export async function check (matches: {[key: string]: any}[]) {
    for(let i = 0; i < matches.length; i++) {
        const match = matches[i];

        const game = await prisma.game.findFirst({
            where: {
                gameType,
                matchId: match.match_id,
                result: 1
            }
        })
        // ищим матчи в период с 20 по 25 минуте и с сухим счетом

        // @TODO Half Time - сигналить на перерыве
        if (
            !!game
            && (parseInt(match.match_status) > 45 && parseInt(match.match_status) < 90)
        ) {
            if (match.match_hometeam_halftime_score === '0' && match.match_awayteam_halftime_score === '0') {
                // console.log('match send', match)
                await prisma.game.update({
                    where: {
                        id: game.id
                    },
                    data: {
                        sendMin: match.match_status,
                        result: 2
                    }
                })
            } else {
                // console.log('match clear', match)
                await prisma.game.update({
                    where: {
                        id: game.id
                    },
                    data: {
                        result: 0
                    }
                })
            }
        }
    }
}
// проверяем сигнали матчи на голы в режиме live
export async function checkSignal(matches: {[key: string]: any}[]) {
    const games = await prisma.game.findMany({
        where: {
            gameType,
            result: 2
        }
    })
    console.log('games', games.length)

    for(let i = 0; i < games.length; i++) {
        const game = games[i]
        const match = matches.find(el => el.match_id === game.matchId)
        // @TODO собирать игры до конца матча - проверить статичстику в какой промежуток больший процет забивания гола
        if (!!match) {
            if (match.goalscorer.length) {
                const goal = match.goalscorer[0]
                await prisma.game.update({
                    where: {
                        id: game.id
                    },
                    data: {
                        goalMin: goal.time,
                        result: 3
                    }
                })
            }
        } else {
            await prisma.game.update({
                where: {
                    id: game.id
                },
                data: {
                    result: 3
                }
            })
        }

    }
}

// @TODO реализовать проверку на соответствие гола или его отмену
// @TODO реализовать проверку ручную на присутствие матча в 1xStavka