import getTasks from './getTasksByList.js';
import fetchClickupObject from './fetchClickupObject.js';
import makeApolloClient from '../services/makeApolloClient.js';
import { ApiServicePostgreSQL } from '../services/ApiService.js';

const clickupUrl = 'https://api.clickup.com/api/v2/';

export default async function getFolders(spaceId, userIds) {
  const apolloClient = makeApolloClient(process.env.HASURA_URL);
  const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
  const url = `${clickupUrl}space/${spaceId}/folder?archived=false`;
  const params = { url, method: 'GET' };
  try {
    const res = await fetchClickupObject(params);
    //   console.log(res);
    const folder = res.folders[0];
    const sprintIds = await folder.lists.map((sprint) => sprint.id);
    const sprintNames = await folder.lists.map((sprint) => sprint.name);
    const sprints = [];
    const latestSprint = await apiServicePostgres.getLatestSprint();
    const latestSprintNumber = parseInt(latestSprint.split(' ')[1])
    for (let i = latestSprintNumber; i < latestSprintNumber+1; i++) {
      let sprintTasks = await getTasks(
        sprintIds[i],
        sprintNames[i],
        userIds,
        0
      );
      sprints.push(sprintTasks);
    }
    return sprints;
  } catch (err) {
    console.log('err while fetching space: ', err);
  }
}
