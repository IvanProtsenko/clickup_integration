import apiServicePostgres from './ApiService.js';

export default async function deleteAllData() {
  await apiServicePostgres.deleteAsigneesTasks();
  await apiServicePostgres.deleteAsignees();
  await apiServicePostgres.deleteTasks();
  await apiServicePostgres.deleteSprints();
}
