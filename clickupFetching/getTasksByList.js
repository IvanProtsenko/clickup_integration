import dotenv from 'dotenv';

import getTaskById from './getTaskById.js';
import fetchClickupObject from './fetchClickupObject.js';
import { ApiServicePostgreSQL } from '../services/ApiService.js';
import makeApolloClient from '../services/makeApolloClient.js';

dotenv.config();
const clickupUrl = 'https://api.clickup.com/api/v2/';

async function createSprint(listId, sprintName) {
  const apolloClient = makeApolloClient(process.env.HASURA_URL);
  const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
  try {
    const sprint = await apiServicePostgres.getSprintByPk(listId);
    if (!sprint)
      await apiServicePostgres.createSprints({ id: listId, name: sprintName });
  } catch (err) {
    console.log('err while creating sprint: ', err);
  }
}

async function createMembers(listId) {
  const apolloClient = makeApolloClient(process.env.HASURA_URL);
  const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
  try {
    const membersUrl = `${clickupUrl}list/${listId}/member`;
    const membersParams = { url: membersUrl, method: 'GET' };

    const members = await fetchClickupObject(membersParams);
    const currentMembers = await apiServicePostgres.getAsignees();
    const currentMembersNames = await currentMembers.map(
      (member) => member.name
    );
    const membersToCreate = [];

    for (let i = 0; i < members.members.length; i++) {
      if (!currentMembersNames.includes(members.members[i].username))
        membersToCreate.push({ name: members.members[i].username });
    }
    await apiServicePostgres.createAsignees(membersToCreate);
  } catch (err) {
    console.log('err while creating members: ', err);
  }
}

export default async function getTasks(listId, sprintName, page) {
  const url = `${clickupUrl}list/${listId}/task?page=${page}&archived=false&subtasks=true&include_closed=true`;
  const params = { url, method: 'GET' };

  try {
    if (page == 0) {
      await createSprint(listId, sprintName);
      await createMembers(listId);
    }

    const res = await fetchClickupObject(params);
    console.log(sprintName + ': ' + res.tasks.length);
    const tasksIds = await res.tasks.map((task) => task.id);
    const tasks = [];
    for (let i = 0; i < tasksIds.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
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
