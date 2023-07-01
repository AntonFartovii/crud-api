import { getPostData } from '../utils/utils';
const User = require('../services/user.service');
import { uuidValidateV4, uuidValidateV4_test } from '../utils/validate';
import { HandlerOptions } from '../Router';
import { IncomingMessage, ServerResponse } from 'http';

async function getUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const users = await User.findAll();
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (err) {
    console.log(err);
  }
}

async function getUser(
  req: IncomingMessage,
  res: ServerResponse,
  { params }: HandlerOptions
): Promise<void> {
  const { userId } = params;
  try {
    uuidValidateV4_test(req, res, userId);
    const user: any = await User.findById(userId);

    if (!user) {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: '404 - user not found ' }));
    } else {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(user));
    }
  } catch (err) {
    console.log(err);
  }
}

async function createUser(req: IncomingMessage, res: ServerResponse) {
  try {
    const body: any = await getPostData(req);
    const { name, age, hobbies } = JSON.parse(body);

    if (!name || !age || !hobbies) {
      res.writeHead(400, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: '400 - body does not contain required fields' }));
      return;
    }

    const user = { name, age, hobbies };
    const newUser: any = await User.create(user);

    res.writeHead(201, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify(newUser));
  } catch (err) {
    console.log(err);
  }
}

async function updateUser(
  req: IncomingMessage,
  res: ServerResponse,
  { params }: HandlerOptions
): Promise<void> {
  const { userId } = params;
  try {
    uuidValidateV4_test(req, res, userId);

    const user: any = await User.findById(userId);

    if (!user) {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: '404 - user not found ' }));
    } else {
      const body: any = await getPostData(req);
      const { name, age, hobbies } = JSON.parse(body);
      const newParams: any = {
        name: name || user.name,
        age: age || user.age,
        hobbies: hobbies || user.hobbies,
      };
      const updateUser: any = User.update(newParams, userId);

      res.writeHead(201, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(await User.findById(userId)));
    }
  } catch (err) {
    console.log(err);
  }
}

async function deleteUser(
  req: IncomingMessage,
  res: ServerResponse,
  { params }: HandlerOptions
): Promise<void> {
  const { userId } = params;
  uuidValidateV4_test(req, res, userId);

  const user = await User.findById(userId);
  try {
    if (!user) {
      res.writeHead(404, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: '404 - user not found ' }));
    } else {
      await User.remove(userId);
      res.writeHead(204, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ message: `product ${userId} has been deleted` }));
    }
  } catch (err) {
    console.log(err);
  }
}

export { getUsers, getUser, createUser, updateUser, deleteUser };
