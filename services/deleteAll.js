import { ApiServicePostgreSQL } from '../services/ApiService.js';
import makeApolloClient from '../services/makeApolloClient.js';

export default async function deleteAllData() {
  const apolloClient = makeApolloClient(process.env.HASURA_URL);
  const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
  await apiServicePostgres.deleteAsigneesTasks();
  await apiServicePostgres.deleteAsignees();
  await apiServicePostgres.deleteTimers();
  await apiServicePostgres.deleteTasks();
  await apiServicePostgres.deleteSprints();
}
