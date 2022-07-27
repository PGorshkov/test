import {PrismaClient} from "@prisma/client";
import {getMatch} from "./service/game";

const prisma = new PrismaClient()

const idChat = 187067603
import { Telegraf } from 'telegraf'
import dayjs from "dayjs";

const bot = new Telegraf('5266091556:AAGdTRPLUah5s-_JnQGfXWH9YES1z0PJlxI')

async function main () {
    const dateMatchTo = dayjs().format('YYYY-MM-DD')
    const dateMatchFrom = dayjs().add(-1, 'day').format('YYYY-MM-DD')
    const dateMatch = '2022-07-26'
    const data = await prisma.game.findMany({
        where: {
            result: 3,
            dateMatch: { in: [dateMatchFrom, dateMatchTo]}
        }
    })

    console.log(data.length)
    const res = {
        m30: 0,
        m60: 0,
        m90: 0,
        lose: 0
    }
    for (let i = 0; i < data.length; i++) {
        const match = data[i]
        let dataMatch = []
        try {

            dataMatch = await getMatch(match.matchId)

        } catch {
            return
        }
        const matchData = dataMatch[0]
        if (!matchData) return
        if (dataMatch[0].goalscorer.length) {
            const goal = parseInt(dataMatch[0].goalscorer[0].time)
            // console.log(match.matchId, goal)
            if(goal >= 0 && goal < 30) {
                res.m30 += 1
            }else if(goal >= 30 && goal < 60) {
                res.m60 += 1
            } else {
                res.m90 += 1
            }
            // @ts-ignore
            await prisma.game.update({
                where: {
                    id: match.id
                },
                data: {
                    goalMin: dataMatch[0].goalscorer[0].time,
                    dateMatch: dataMatch[0].match_date
                }
            })
        } else if (dataMatch[0].match_status === 'Finished'){
            res.lose += 1
            await prisma.game.update({
                where: {
                    id: match.id
                },
                data: {
                    goalMin: '0',
                    dateMatch: dataMatch[0].match_date
                }
            })
        }
    }

    console.log(res)
    await bot.telegram.sendMessage(idChat, `Всего матчей - ${data.length} на ${dateMatch}\nГол до 30 минуты - ${res.m30}\nГол до 60 минуты - ${res.m60}\nГол до 90 минуты - ${res.m90}\nСухая игра - ${res.lose}`)
}

async function removeGame () {
    const data = await prisma.game.updateMany({
        where: {
            gameType: 'GOAL_FIRST_TIME',
            matchHomeTeamName: {
                in: []
            }
        },
        data: {
            result: 0
        }
    })
    // Guarani de Trinidad, Heroes de Falcon, Comerciantes Unidos, Llaneros, Costa Rica,
    // AE Altos, Union Comercio, Los Angeles Galaxy, Managua FC, Chico, Colorado Rapids 2, Houston Dynamo 2,
    // Austin FC, Pachuca-U.N.A.M., Barcelona SC, Boca Juniors,
    // Independiente Petrolero, Zamora, Orlando City B, Binacional, Brasil de Pelotas, Cerro Porteno
    console.log('data', data);
}

async function getLoseLeague () {
    // const data = await prisma.game.findMany({
    //     where: {
    //         result: 3,
    //         goalMin: '0'
    //     },
    //     select: {
    //         countryName: true,
    //         leagueId: true,
    //         leagueName: true,
    //         matchHomeTeamName: true,
    //         matchAwayTeamName: true,
    //     },
    // })

    const data = await prisma.game.groupBy({
        by: ['leagueId'],
        where: {
            result: 3,
            goalMin: '0'
        },
        _count: {
            leagueName: true,
        },
    })

    console.table(data)
}

main()