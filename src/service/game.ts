import _axios from "../utils/axios";

export async function getLive(){
    try {
        const { data } = await _axios.get('', {
            params: {
                action: 'get_events',
                match_live: 1,
                timezone: 'Europe/Moscow'
            }
        })
        return data
    } catch (e) {
        console.log(e)
        return []
    }
}

import dayjs from "dayjs";

const to = dayjs().add(-1, 'day').format('YYYY-MM-DD')
const from = dayjs().add(-1, 'year').format('YYYY-MM-DD')

export async function getMatchTeam(teamId: string, leagueId: string) {
    const { data } = await _axios.get('', {
        params: {
            action: 'get_events',
            team_id: teamId,
            league_id: leagueId,
            from,
            to,
            timezone: 'Europe/Moscow'
        }
    })

    return data
}

export async function getMatch(matchId: string) {
    const { data } = await _axios.get('', {
        params: {
            action: 'get_events',
            match_id: matchId,
        }
    })

    return data
}