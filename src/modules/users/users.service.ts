import { Injectable } from '@nestjs/common';
import { User } from './types/userTypes';

@Injectable()
export class UsersService {
     private readonly users : User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findone(username: number): Promise<User | undefined> {
    return this.users.find(user => user.userId === username);
  }

  async findAll(): Promise<User[] | undefined> {
    return this.users;
  }
}