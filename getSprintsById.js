import getTasks from './getTasksByList.js';
import fetchClickupObject from './fetchClickupObject.js';

const clickupUrl = 'https://api.clickup.com/api/v2/';

export default async function getFolders(spaceId) {
  const url = `${clickupUrl}/space/${spaceId}/folder?archived=false`;
  const params = { url, method: 'GET' };
  const res = await fetchClickupObject(params);
  //   console.log(res);
  const folder = res.folders[1];
  const sprintIds = folder.lists.map((sprint) => sprint.id);
  const sprintNames = folder.lists.map((sprint) => sprint.name);
  const sprints = [];
  sprintIds.forEach((sprintId, index) => {
    let sprintTasks = getTasks(sprintId, sprintNames[index]);
    sprints.push(sprintTasks);
  });
  return sprints;
}
