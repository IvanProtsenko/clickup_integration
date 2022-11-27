import getTaskById from './getTaskById.js';
import fetchClickupObject from './fetchClickupObject.js';

const clickupUrl = 'https://api.clickup.com/api/v2/';

export default async function getTasks(listId, sprintName, page) {
  const url = `${clickupUrl}list/${listId}/task?page=${page}&archived=false&subtasks=true&include_closed=true`;
  const params = { url, method: 'GET' };
  try {
    const res = await fetchClickupObject(params);
    console.log(sprintName + ': ' + res.tasks.length);
    const tasksIds = await res.tasks.map((task) => task.id);
    const tasks = [];
    for (let i = 0; i < tasksIds.length; i++) {
      await new Promise((r) => setTimeout(r, 250));
      let task = await getTaskById(tasksIds[i]);
      tasks.push(task);
    }

    let additionalTasks = [];
    if (tasksIds.length >= 100) {
      console.log('more pages!');
      additionalTasks = await getTasks(listId, sprintName, ++page);
    }

    return tasks.concat(additionalTasks);
  } catch (err) {
    console.log('err while fetching sprint: ', err);
  }
}
