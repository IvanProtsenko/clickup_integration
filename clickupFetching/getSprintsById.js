import getTasks from './getTasksByList.js';
import fetchClickupObject from './fetchClickupObject.js';

const clickupUrl = 'https://api.clickup.com/api/v2/';

export default async function getFolders(spaceId, userIds) {
  const url = `${clickupUrl}space/${spaceId}/folder?archived=false`;
  const params = { url, method: 'GET' };
  try {
    const res = await fetchClickupObject(params);
    //   console.log(res);
    const folder = res.folders[0];
    const sprintIds = await folder.lists.map((sprint) => sprint.id);
    const sprintNames = await folder.lists.map((sprint) => sprint.name);
    const sprints = [];
    for (let i = 37; i < sprintIds.length-1; i++) {
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
