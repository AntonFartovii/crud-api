import { v4 as uuidv4 } from 'uuid';

let memory: any[] = [];

function findAll() {
  return new Promise((res, req) => {
    const users: any = memory;
    res(users);
  });
}

function findById(id: string) {
  return new Promise((res, req) => {
    const user = memory.find((u: any) => u.id === id);
    res(user);
  });
}

function create(user: any) {
  return new Promise((res, req) => {
    const newUser = { id: uuidv4(), ...user };
    memory.push(newUser);
    res(newUser);
  });
}

function update(params: any, id: string) {
  return new Promise((res, req) => {
    const index = memory.findIndex((u: any) => u.id === id);
    memory[index] = { id, ...params };
    res(memory[index]);
  });
}

function remove(id: string) {
  return new Promise((res, req) => {
    const newMemory = memory.filter((u: any) => u.id !== id);
    memory = newMemory;
    res('ok');
  });
}

export { findAll, findById, create, update, remove };
