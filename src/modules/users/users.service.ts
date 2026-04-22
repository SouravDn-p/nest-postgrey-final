import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './types/userTypes';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper to exclude sensitive fields
  private readonly userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    avatarUrl: true,
    isVerified: true,
    isBlocked: true,
    isDeleted: true,
    role: true,
    walletBalance: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
    deletedAt: true,
    // passwordHash is omitted by default
  };

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as unknown as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: this.userSelect,
    });
    return users as unknown as User[];
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash: password, // Note: Password should be hashed in a production environment
      },
      select: this.userSelect,
    });
    return user as unknown as User;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Ensure user exists
    
    const { password, ...userData } = updateUserDto;
    const updateData: any = { ...userData };
    
    if (password) {
      updateData.passwordHash = password; // Note: Password should be hashed in a production environment
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.userSelect,
    });
    return user as unknown as User;
  }

  async remove(id: number): Promise<User> {
    await this.findOne(id); // Ensure user exists
    const user = await this.prisma.user.delete({
      where: { id },
      select: this.userSelect,
    });
    return user as unknown as User;
  }
}