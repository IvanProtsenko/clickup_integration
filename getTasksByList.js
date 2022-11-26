import getTaskById from './getTaskById.js';
import fetchClickupObject from './fetchClickupObject.js';

const clickupUrl = 'https://api.clickup.com/api/v2/';

export default async function getTasks(listId, sprintName) {
  //   const statusArray = ['DONE'];
  //   const statusString = statusArray
  //     .map((el) => `&statuses%5B%5D=${el}`)
  //     .join('');

  //   const asignees = ['Ivan Protsenko'];
  //   const asigneesString = asignees.map((el) => `&asignees=${el}`).join('');

  const url = `${clickupUrl}/list/${listId}/task?archived=false&page=0&subtasks=true&include_closed=true&`;
  const params = { url, method: 'GET' };
  const res = await fetchClickupObject(params);
  console.log(sprintName + ': ' + res.tasks.length);
  const tasksIds = res.tasks.map((task) => task.id);
  const tasks = [];
  tasksIds.forEach((taskId) => {
    let task = getTaskById(taskId);
    tasks.push(task);
  });
  return tasks;
}
