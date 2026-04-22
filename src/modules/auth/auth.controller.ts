import { BadRequestException, Body, Controller, Post, Res, UploadedFile, UseInterceptors, Get, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageMulterOptions } from 'src/config/multer.config';
import { LoginDto } from './dto/login.dto';
import { buildCookieOptions, ACCESS_MAX_AGE, REFRESH_MAX_AGE } from 'src/common/utils/cookie.util';
import { ApiResponseHelper } from 'src/common/utils/api-response.util';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtUser } from 'src/common/types/commonAuthTypes';
import { RefreshAuthGuard } from 'src/common/guards/refresh.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  @Public()
  @UseInterceptors(FileInterceptor('avatar', imageMulterOptions))
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const exist = await this.userService.findByEmail(createUserDto.email);
    if (exist) {
      throw new BadRequestException('User already exists');
    }

    let imageUrl: string | undefined = undefined;
    if (file) {
      const upload = await this.cloudinaryService.uploadFile(file, 'nest-practice');
      imageUrl = upload.url;
    }

    const user = await this.userService.create({ ...createUserDto, avatarUrl: imageUrl });
    return ApiResponseHelper.success(user, 'User registered successfully', 201);
  }

  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('accessToken', result.accessToken, buildCookieOptions(ACCESS_MAX_AGE));
    res.cookie('refreshToken', result.refreshToken, buildCookieOptions(REFRESH_MAX_AGE));

    return ApiResponseHelper.success({ user: result.user }, 'Login successful');
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.authService.refreshToken(user.userId, user.refreshToken);

    res.cookie('accessToken', tokens.accessToken, buildCookieOptions(ACCESS_MAX_AGE));
    res.cookie('refreshToken', tokens.refreshToken, buildCookieOptions(REFRESH_MAX_AGE));

    return ApiResponseHelper.success(null, 'Token refreshed successfully');
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('accessToken', buildCookieOptions(0));
    res.clearCookie('refreshToken', buildCookieOptions(0));

    return ApiResponseHelper.success(null, 'Logged out successfully');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: JwtUser) {
    const userData = await this.userService.findOne(user.userId);
    return ApiResponseHelper.success(userData, 'User profile fetched successfully');
  }
}
