import {PrismaClient} from "@prisma/client";

const idChat = 187067603
import { Telegraf } from 'telegraf'

const bot = new Telegraf('5266091556:AAGdTRPLUah5s-_JnQGfXWH9YES1z0PJlxI')

const prisma = new PrismaClient()

const gameType = 'GOAL_75';

// поиск подходящих матчей
export async function initMatch (matches: {[key: string]: any}[]) {
    const games = await prisma.game.findMany({
        where: {
            gameType,
            result: 1
        }
    })
    console.log(games.length)
    return
    const initMatches = matches
        .filter((el: any) => {
            return el.statistics_1half.length !== 0 && el.match_status === 'Half Time'
        })
    console.log('matches', initMatches.length)
    for (let i = 0; i < initMatches.length; i++) {
        const match = initMatches[i]
        const isMatch = games.find(el => el.matchId === match.match_id)
        if(!isMatch) {
            let onTargetShots = 0
            let offTargetShots = 0
            let goals = 0
            const onTarget = match.statistics_1half.find((el: any) => el.type === 'On Target')
            const offTarget = match.statistics_1half.find((el: any) => el.type === 'Off Target')
            goals += (parseInt(match.match_hometeam_halftime_score) + parseInt(match.match_awayteam_halftime_score))
            onTargetShots += (parseInt(onTarget.home) + parseInt(onTarget.away))
            offTargetShots += (parseInt(offTarget.home) + parseInt(offTarget.away))


            if (onTargetShots > 5) {
                console.log(match.match_id, onTargetShots, offTargetShots, goals)
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
                await prisma.game.create({
                    data: {
                        ...data,
                        result: 1
                    }
                })
            }
        }
    }
}

export async function setSignal(matches: {[key: string]: any}[]) {
    const games = await prisma.game.findMany({
        where: {
            gameType,
            result: 1
        }
    })
    // const initMatches = matches
    //     .filter((el: any) => {
    //         // return el.goalscorer.filter((el: any) => el.score_info_time === '2nd Half').length === 0 && parseInt(el.match_status) > 53
    //         return games.some(g => g.matchId === el.match_id)
    //     })

    // console.log('setSignal - initMatches', initMatches)

    for(let i = 0; i < games.length; i++) {
        const game = games[i]
        const match = matches.find(el => el.match_id === game.matchId)
        if(!!match) {
            const goals2Half = match.goalscorer.filter((el: any) => el.score_info_time === '2nd Half').length
            if(!goals2Half) {
                if(parseInt(match.match_status) > 53) {
                    await bot.telegram.sendMessage(idChat, `${match.country_name}\n${match.league_name}\n${match.match_hometeam_name}-${match.match_awayteam_name}\n BOT 54MIN`)
                    // даем сигнал
                    await prisma.game.update({
                        where: {
                            id: game.id,
                        },
                        data: {
                            sendMin: match.match_status,
                            result: 2
                        }
                    })
                }
            } else {
                await prisma.game.update({
                    where: {
                        id: game.id,
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
export async function checkGoal(matches: {[key: string]: any}[]) {
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
            const goals = match.goalscorer.filter((el: any) => el.score_info_time === '2nd Half')
            if (goals.length) {
                const goal = goals[0]
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
                    goalMin: '0',
                    result: 3
                }
            })
        }

    }
}