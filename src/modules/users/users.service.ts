import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './types/userTypes';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as unknown as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users as unknown as User[];
  }

  async create(
    userData: any, // Use any or a specific DTO for flexibility
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user as unknown as User;
  }

  async update(id: number, data: any): Promise<User> {
    await this.findOne(id); // Ensure user exists
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return user as unknown as User;
  }

  async remove(id: number): Promise<User> {
    await this.findOne(id); // Ensure user exists
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return user as unknown as User;
  }
}