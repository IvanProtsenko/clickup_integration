import fetchClickupObject from './fetchClickupObject.js';

const clickupUrl = 'https://api.clickup.com/api/v2/';

export default async function getTaskById(taskId) {
  const url = `${clickupUrl}task/${taskId}?custom_task_ids=true&include_subtasks=true`;
  const params = { url, method: 'GET' };
  try {
    const res = await fetchClickupObject(params);
    //   console.log(res);
    return res;
  } catch (err) {
    console.log('err while fetching task: ', err);
  }
}
