import dotenv from 'dotenv';
import { ApiServicePostgreSQL } from '../services/ApiService.js';
import makeApolloClient from '../services/makeApolloClient.js';
import fetchClickupObject from './fetchClickupObject.js';

dotenv.config();
const clickupUrl = 'https://api.clickup.com/api/v2/';
const teamId = 24350959;

export default async function getTaskTimer(taskId, userIds) {
  const apolloClient = makeApolloClient(process.env.HASURA_URL);
  const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
  const url = `${clickupUrl}team/${teamId}/time_entries?start_date=0&assignee=${userIds}&include_location_names=true&task_id=${taskId}`;
  const params = { url, method: 'GET' };
  try {
    const res = await fetchClickupObject(params);
    const timers = [];
    for (let i = 0; i < res.data.length; i++) {
      let newTimer = {
        id: res.data[i].id,
        asigneeName: res.data[i].user.username,
        taskId,
        duration: Math.floor(res.data[i].duration / 60000),
        start: res.data[i].start,
        end: res.data[i].end,
      };
      let existingTimer = await apiServicePostgres.getTimerByPk(newTimer.id);
      if (!existingTimer) timers.push(newTimer);
    }
    return timers
  } catch (err) {
    console.log('err while fetching task: ', err);
  }
}
