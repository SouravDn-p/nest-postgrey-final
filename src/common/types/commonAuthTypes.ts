import { UserRole } from "./enum/roles.enum";

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface JwtUser {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}
