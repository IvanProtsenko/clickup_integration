import dotenv from 'dotenv';
import pkg from '@apollo/client';
const { gql } = pkg;
import makeApolloClient from './makeApolloClient.js';

dotenv.config();

export class ApiServicePostgreSQL {
  client = null;

  GET_LATEST_SPRINT = gql`
    query GetLatestSprint {
      Sprint(order_by: {created_at: desc}, limit: 1) {
        name
      }
    }
  `

  GET_ASIGNEES = gql`
    query GetAsignees {
      Asignee {
        name
      }
    }
  `;

  GET_SPRINT_BY_PK = gql`
    query GetSprintByPk($id: String!) {
      Sprint_by_pk(id: $id) {
        id
        name
      }
    }
  `;

  GET_TASK_BY_PK = gql`
    query GetTaskByPk($id: String!) {
      Task_by_pk(id: $id) {
        id
      }
    }
  `;

  GET_ASIGNEE_TASKS_BY_IDS = gql`
    query GetAsigneeTaskByIds($asigneeName: String, $taskId: String) {
      AsigneeTasks(
        where: {
          _and: {
            asignee_name: { _eq: $asigneeName }
            task_id: { _eq: $taskId }
          }
        }
      ) {
        asignee_name
        task_id
      }
    }
  `;

  GET_ASIGNEE_BY_PK = gql`
    query GetAsigneeByPk($name: String!) {
      Asignee_by_pk(name: $name) {
        name
      }
    }
  `;

  GET_TIMER_BY_PK = gql`
    query GetTimerByPk($id: String!) {
      Timers_by_pk(id: $id) {
        id
      }
    }
  `;

  CREATE_TASK = gql`
    mutation createTasks($objects: [Task_insert_input!]!) {
      insert_Task(objects: $objects) {
        returning {
          id
        }
      }
    }
  `;

  CREATE_ASIGNEES = gql`
    mutation createAsignee($objects: [Asignee_insert_input!]!) {
      insert_Asignee(objects: $objects) {
        affected_rows
      }
    }
  `;

  CREATE_TIMERS = gql`
    mutation CreateTimers($objects: [Timers_insert_input!]!) {
      insert_Timers(objects: $objects) {
        affected_rows
      }
    }
  `;

  CREATE_ASIGNEES_TASKS = gql`
    mutation createAsigneeTasks($objects: [AsigneeTasks_insert_input!]!) {
      insert_AsigneeTasks(objects: $objects) {
        affected_rows
      }
    }
  `;

  CREATE_SPRINTS = gql`
    mutation createSprints($objects: [Sprint_insert_input!]!) {
      insert_Sprint(objects: $objects) {
        affected_rows
      }
    }
  `;

  DELETE_ASIGNEES_TASKS = gql`
    mutation deleteAllAsigneeTasks {
      delete_AsigneeTasks(where: { task_id: { _neq: "0" } }) {
        affected_rows
      }
    }
  `;

  DELETE_ASIGNEES = gql`
    mutation deleteAllAsignees {
      delete_Asignee(where: { name: { _neq: "0" } }) {
        affected_rows
      }
    }
  `;

  DELETE_TASKS = gql`
    mutation deleteAllTasks {
      delete_Task(where: { id: { _neq: "0" } }) {
        affected_rows
      }
    }
  `;

  DELETE_SPRINTS = gql`
    mutation deleteAllSprints {
      delete_Sprint(where: { id: { _neq: "0" } }) {
        affected_rows
      }
    }
  `;

  DELETE_TIMERS = gql`
    mutation DeleteAllTimers {
      delete_Timers(where: { id: { _neq: "0" } }) {
        affected_rows
      }
    }
  `;

  constructor(client) {
    this.client = client;
  }

  getAsignees = async () => {
    try {
      const result = await this.client.query({
        query: this.GET_ASIGNEES,
      });
      return result.data.Asignee;
    } catch (err) {
      console.log('ERROR getAsignees:', err);
    }
  };

  getSprintByPk = async (id) => {
    try {
      const result = await this.client.query({
        query: this.GET_SPRINT_BY_PK,
        variables: {
          id,
        },
      });
      return result.data.Sprint_by_pk;
    } catch (err) {
      console.log('ERROR getSprintByPk:', err);
    }
  };

  getTaskByPk = async (id) => {
    try {
      const result = await this.client.query({
        query: this.GET_TASK_BY_PK,
        variables: {
          id,
        },
      });
      return result.data.Task_by_pk;
    } catch (err) {
      console.log('ERROR getTaskByPk:', err);
    }
  };

  getTimerByPk = async (id) => {
    try {
      const result = await this.client.query({
        query: this.GET_TIMER_BY_PK,
        variables: {
          id,
        },
      });
      return result.data.Timers_by_pk;
    } catch (err) {
      console.log('ERROR getTimerByPk:', err);
    }
  };

  getAsigneeTasks = async (asigneeName, taskId) => {
    try {
      const result = await this.client.query({
        query: this.GET_ASIGNEE_TASKS_BY_IDS,
        variables: {
          asigneeName,
          taskId,
        },
      });
      return result.data.AsigneeTasks;
    } catch (err) {
      console.log(asigneeName, taskId);
      console.log('ERROR getAsigneeTasks:', err);
    }
  };

  getLatestSprint = async () => {
    try {
      const result = await this.client.query({
        query: this.GET_LATEST_SPRINT,
      });
      return result.data.Sprint[0].name;
    } catch (err) {
      console.log('ERROR getLatestSprint:', err);
    }
  }

  getAsigneeByPk = async (name) => {
    try {
      const result = await this.client.query({
        query: this.GET_ASIGNEE_BY_PK,
        variables: {
          name,
        },
      });
      return result.data.Asignee_by_pk;
    } catch (err) {
      console.log(name);
      console.log('ERROR getAsigneeByPk:', err);
    }
  };

  createAsigneesTasks = async (objects) => {
    try {
      await this.client.mutate({
        mutation: this.CREATE_ASIGNEES_TASKS,
        variables: {
          objects,
        },
      });
    } catch (err) {
      console.log(objects);
      console.log('ERROR createAsigneesTasks:', err);
    }
  };

  createAsignees = async (objects) => {
    try {
      await this.client.mutate({
        mutation: this.CREATE_ASIGNEES,
        variables: {
          objects,
        },
      });
    } catch (err) {
      console.log('ERROR createAsignees:', err);
    }
  };

  createTasks = async (objects) => {
    try {
      const result = await this.client.mutate({
        mutation: this.CREATE_TASK,
        variables: {
          objects,
        },
      });
      return result.data.insert_Task;
    } catch (err) {
      console.log('ERROR createTasks:', err);
    }
  };

  createTimers = async (objects) => {
    try {
      await this.client.mutate({
        mutation: this.CREATE_TIMERS,
        variables: {
          objects,
        },
      });
    } catch (err) {
      console.log('ERROR createTimers:', err);
    }
  };

  createSprints = async (objects) => {
    try {
      await this.client.mutate({
        mutation: this.CREATE_SPRINTS,
        variables: {
          objects,
        },
      });
    } catch (err) {
      console.log('ERROR createSprints:', err);
    }
  };

  deleteAsigneesTasks = async () => {
    try {
      await this.client.mutate({
        mutation: this.DELETE_ASIGNEES_TASKS,
      });
    } catch (err) {
      console.log('ERROR deleteAsigneesTasks:', err);
    }
  };

  deleteAsignees = async () => {
    try {
      await this.client.mutate({
        mutation: this.DELETE_ASIGNEES,
      });
    } catch (err) {
      console.log('ERROR deleteAsignees:', err);
    }
  };

  deleteTasks = async () => {
    try {
      await this.client.mutate({
        mutation: this.DELETE_TASKS,
      });
    } catch (err) {
      console.log('ERROR deleteTasks:', err);
    }
  };

  deleteSprints = async () => {
    try {
      await this.client.mutate({
        mutation: this.DELETE_SPRINTS,
      });
    } catch (err) {
      console.log('ERROR deleteSprints:', err);
    }
  };

  deleteTimers = async () => {
    try {
      await this.client.mutate({
        mutation: this.DELETE_TIMERS,
      });
    } catch (err) {
      console.log('ERROR deleteTimers:', err);
    }
  };
}

const apolloClient = makeApolloClient(process.env.HASURA_URL);
const apiServicePostgres = new ApiServicePostgreSQL(apolloClient);
export default { apiServicePostgres, ApiServicePostgreSQL };
