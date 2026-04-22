import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
  UsersModule,
  CloudinaryModule,
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: { expiresIn: '1d' },
  }),
  MulterModule.register({ dest: './uploads/avatars' }),
  ],
  controllers: [AuthController],
  providers: [AuthService , JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
