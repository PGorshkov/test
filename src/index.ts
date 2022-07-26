
const schedule = require('node-schedule');
import { getLive } from "./service/game";
import {check, checkSignal, initMatch} from "./stats/goalFirstTime";

async function main() {
    try {
        const data = await getLive()
        if (Array.isArray(data)) {
            await checkSignal(data)
            await initMatch(data)
            await check(data)
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