import { Decimal } from "@prisma/client/runtime/client";
import { UserRole } from "src/common/types/enum/roles.enum";

export interface User {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  passwordHash?: string | null;
  role: UserRole;
  walletBalance: Decimal;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  deletedAt?: Date | null;
}