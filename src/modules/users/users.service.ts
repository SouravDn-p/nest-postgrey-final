import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './types/userTypes';

@Injectable()
export class UsersService {
    private readonly users : User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: 'admin',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: 'user',
    },
  ];

  async findone(id: number): Promise<User | undefined> {
    const user = this.users.find(user => user.userId === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[] | undefined> {
    return this.users;
  }
}