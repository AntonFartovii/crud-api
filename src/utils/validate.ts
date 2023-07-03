import { IncomingMessage, ServerResponse } from 'http';

const { validate: uuidValidate } = require('uuid');
const { version: uuidVersion } = require('uuid');

export const uuidValidateV4_test = (
  req: IncomingMessage,
  res: ServerResponse,
  uuid: string
): boolean => {
  const valid = uuidValidate(uuid) && uuidVersion(uuid) === 4;
  if (!valid) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: '400 - ID is not valid ' }));
    return false;
  }
  return true;
};

export const uuidValidateV4 = (uuid: string): boolean => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};

export const bodyValidate = (body: string): boolean => {
  return false;
};

export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
