import fetchClickupObject from './fetchClickupObject.js';

const clickupUrl = 'https://api.clickup.com/api/v2/';

export default async function getTaskById(taskId) {
  const url = `${clickupUrl}/task/${taskId}?custom_task_ids=true&team_id=123&include_subtasks=true`;
  const params = { url, method: 'GET' };
  const res = await fetchClickupObject(params);
  //   console.log(res);
  return res;
}
