import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './types/userTypes';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

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

  async findByEmail(email: string, includePassword = false): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
      select: includePassword ? { ...this.userSelect, passwordHash: true } : this.userSelect,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: this.userSelect,
    });
    return users as unknown as User[];
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
 try {
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        passwordHash: passwordHash,
      },
      select: this.userSelect,
    });
    return user as unknown as User;
     } catch (error)  {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[];

        if (target?.includes('email')) {
          throw new ConflictException('Email already exists');
        }

        if (target?.includes('phone')) {
          throw new ConflictException('Phone number already exists');
        }

        throw new ConflictException('Unique field already exists');
      }

      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Ensure user exists
    
    const { password, ...userData } = updateUserDto;
    const updateData: any = { ...userData };
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
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