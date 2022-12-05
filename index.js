import getFolders from './clickupFetching/getSprintsById.js';
import deleteAllData from './services/deleteAll.js';
import getSpaceMembers from './clickupFetching/getTeamMembers.js';

const spaceId = 48455188;
// const teamId = 24350959;
// await getTaskTimer();

const userIds = await getSpaceMembers();

await getFolders(spaceId, userIds);
// await deleteAllData();
