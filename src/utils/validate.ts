const { validate: uuidValidate } = require('uuid');
const { version: uuidVersion } = require('uuid');

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
