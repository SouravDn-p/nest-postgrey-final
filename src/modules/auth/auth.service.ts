import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/types/commonAuthTypes';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user);
    
    // Remove passwordHash before returning user
    const { passwordHash, ...safeUser } = user;
    
    return {
      user: safeUser,
      ...tokens,
    };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('Access Denied');
    
    // In a more robust setup, you might store refresh tokens in the DB and compare them here.
    // For now, we trust the JWT since it was signed with our secret.

    const tokens = await this.getTokens(user);
    return tokens;
  }

  async getTokens(user: any) {
    const payload: JwtPayload = {
      sub: String(user.id),
      username: `${user.firstName} ${user.lastName || ''}`.trim(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN) || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
