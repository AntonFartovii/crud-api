import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, User } from '../interfaces/user.interfase';

let memory: User[] = [];

function findAll(): Promise<User[] | undefined> {
  return new Promise((res): void => {
    const users: User[] = memory;
    res(users);
  });
}

function findById(id: string): Promise<User | undefined> {
  return new Promise((res): void => {
    const user = memory.find((u: User) => u.id === id);
    res(user);
  });
}

function create(user: CreateUserDto) {
  return new Promise((res) => {
    const newUser = { id: uuidv4(), ...user };
    memory.push(newUser);
    res(newUser);
  });
}

function update(params: Partial<CreateUserDto>, id: string) {
  return new Promise((res) => {
    const index = memory.findIndex((u: User) => u.id === id);
    memory[index] = <User>{ id, ...params };
    res(memory[index]);
  });
}

function remove(id: string) {
  return new Promise((res) => {
    const newMemory: User[] = memory.filter((u: User) => u.id !== id);
    memory = newMemory;
    res('ok');
  });
}

export { findAll, findById, create, update, remove };
