
const schedule = require('node-schedule');
import { getLive } from "./service/game";
import {initMatch, setSignal, checkGoal} from "./stats/goal75";

async function main() {
    try {
        const data = await getLive()
        if (Array.isArray(data)) {
            await checkGoal(data)
            await setSignal(data)
            await initMatch(data)
        }
    } catch (e) {
        console.log('main', e)
    }
}

let isJobWork = false
schedule.scheduleJob('*/30 * * * * *', async function(){
    if (!isJobWork) {
        console.log('start')
        isJobWork = true
        try{
            await main()
        } catch (e) {
            console.log('schedule', e)
        }
        console.log('stop')
        isJobWork = false
    }
});

// main()
//     .catch((e) => {
//         throw e
//     })
    // .finally(async () => {
    //     await prisma.$disconnect()
    // })