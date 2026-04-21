import { UserRole } from "src/common/types/enum/roles.enum";

export interface User {
  id: number;
  username: string;
  email?: string | null;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}