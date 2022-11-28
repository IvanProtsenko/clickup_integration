import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const clickupToken = process.env.CLICKUP_AUTHORIZATION_KEY;
const clickupReqBody = { Authorization: clickupToken };

export default async function fetchClickupObject(params) {
  try {
    const response = await fetch(params.url, {
      headers: clickupReqBody,
      method: params.method,
    });
    return response.json();
  } catch (err) {
    console.log('err: ', err);
  }
}
