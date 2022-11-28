import getFolders from './clickupFetching/getSprintsById.js';
import deleteAllData from './services/deleteAll.js';

const spaceId = 48455188;

await getFolders(spaceId);
// await deleteAllData();
