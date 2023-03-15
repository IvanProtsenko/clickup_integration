import dotenv from 'dotenv';

import fetchClickupObject from './fetchClickupObject.js';
import { ApiServicePostgreSQL } from '../services/ApiService.js';
import makeApolloClient from '../services/makeApolloClient.js';
import getTaskTimer from './getTaskTime.js';

dotenv.config();
const clickupUrl = 'https://api.clickup.com/api/v2/';

function removeDublicateTimers(timers, existingTimers) {
  for(let i = 0; i < timers.length; i++) {
    for(let j = 0; j < existingTimers.length; j++) {
      if(existingTimers[j].start == timers[i].start && existingTimers[j].end == timers[i].end) {
        timers.splice(i, 1)
        return removeDublicateTimers(timers, existingTimers)
      }
    }
  }
  return timers
}

async function createAsigneeTasks(res) {
  const apolloClient = makeApolloClient(process.env.HASURA_URL);
  const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
  try {
    const asignees = await res.assignees.map((asignee) => asignee.username);
    for (let i = 0; i < asignees.length; i++) {
      let existingConnection = await apiServicePostgres.getAsigneeTasks(
        asignees[i].toString(),
        res.id.toString()
      );

      const existingAsignee = await apiServicePostgres.getAsigneeByPk(
        asignees[i]
      );

      if (!existingAsignee)
        await apiServicePostgres.createAsignees({ name: asignees[i] });

      if (existingConnection.length == 0)
        await apiServicePostgres.createAsigneesTasks({
          asignee_name: asignees[i].toString(),
          task_id: res.id.toString(),
        });
    }
  } catch (err) {
    console.log('err while creating asignees: ', err);
  }
}

function calculateCustomFields(customFields) {
  let satisfaction = null;
  let project_name = null;
  let task_type = null;

  for (let i = 0; i < customFields.length; i++) {
    if (customFields[i].name == 'Satisfaction') {
      satisfaction = customFields[i].value || null;
    } else if (customFields[i].name == 'Task type') {
      const task = customFields[i];
      if(task.type_config.options) {
        for (let j = 0; j < task.type_config.options.length; j++) {
          if (task.type_config.options[j].orderindex == task.value) {
            task_type = task.type_config.options[j].name;
          }
        }
      }
    } else if (customFields[i].name == 'Projects') {
      const project = customFields[i];
      if(project.type_config.options) {
        for (let j = 0; j < project.type_config.options.length; j++) {
          if (project.type_config.options[j].orderindex == project.value) {
            project_name = project.type_config.options[j].name;
          }
        }
      }
    }
  }

  return { satisfaction, project_name, task_type };
}

export default async function getTaskById(taskId, userIds, existingTimers) {
  const apolloClient = makeApolloClient(process.env.HASURA_URL);
  const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
  const url = `${clickupUrl}task/${taskId}?custom_task_ids=true&include_subtasks=true`;
  const params = { url, method: 'GET' };
  try {
    const res = await fetchClickupObject(params);
    const customFields = calculateCustomFields(res.custom_fields);
    const tags = res.tags.map((tag) => tag.name).join();

    const taskToCreate = {
      id: res.id,
      sprint_id: res.list.id,
      name: res.name,
      status: res.status ? res.status.status : null,
      priority: res.priority ? res.priority.priority : null,
      task_type: customFields.task_type,
      time_spent: res.time_spent.toString() || null,
      satisfaction: customFields.satisfaction,
      sprint_points: res.points || null,
      project_name: customFields.project_name,
      tags,
    };

    let existingTask = await apiServicePostgres.getTaskByPk(taskToCreate.id);

    if (!existingTask) {
      const createdTask = await apiServicePostgres.createTasks(taskToCreate);
      await getTaskTimer(createdTask.returning[0].id, userIds);
      const timers = await getTaskTimer(createdTask.returning[0].id, userIds);
      const newTimers = removeDublicateTimers(timers, existingTimers)
      taskToCreate.timers = newTimers
      
      await apiServicePostgres.createTimers(newTimers);
    }

    await createAsigneeTasks(res);

    return taskToCreate;
  } catch (err) {
    console.log('err while fetching task: ', err);
  }
}
