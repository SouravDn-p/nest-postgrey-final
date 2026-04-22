import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './types/userTypes';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    return user as unknown as User;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Ensure user exists
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
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