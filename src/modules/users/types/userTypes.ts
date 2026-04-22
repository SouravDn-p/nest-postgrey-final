import { Role } from "@prisma/client";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}