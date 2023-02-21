import getFolders from './clickupFetching/getSprintsById.js';
import deleteAllData from './services/deleteAll.js';
import getSpaceMembers from './clickupFetching/getTeamMembers.js';
import express from 'express';

const app = express();

const spaceId = 48455188;
// const teamId = 24350959;
// await getTaskTimer();
// await deleteAllData();

async function runInCycle() {
    // while(true) {
    //     let now = new Date()
    //     if(now.getDay() == 6 && now.getHours() == 23) {
            console.log('clickup updating started')
            const userIds = await getSpaceMembers();

            await getFolders(spaceId, userIds);
            console.log('clickup updating stopped')
    //     } else {
    //       await new Promise(r => setTimeout(r, 60 * 60 * 1000));
    //     }
    // }
}

async function run() {
    const port = 4000;
  
    app.get('/', async (req, res) => {
      res.send('Hello World!');
    });
  
    app.listen(port, async () => {
      console.log(`Example app listening on port ${port}`);
      await runInCycle();
    });
}
  
run();
