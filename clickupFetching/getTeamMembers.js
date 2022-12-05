import fetchClickupObject from './fetchClickupObject.js';

export default async function getSpaceMembers() {
  const url = 'https://api.clickup.com/api/v2/team';
  const params = { url, method: 'GET' };
  try {
    const res = await fetchClickupObject(params);
    const arrayUsersIds = res.teams[0].members.map((member) => member.user.id);
    return arrayUsersIds.join();
  } catch (err) {
    console.log('err while fetching team members: ', err);
  }
}
