import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './common/prisma/prisma.module';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import cloudinaryConfig from './config/cloudinary.config';
import databaseConfig from './config/database.config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
      envFilePath: [
        `.env.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
      ],
      load: [appConfig, jwtConfig, cloudinaryConfig, databaseConfig],
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
