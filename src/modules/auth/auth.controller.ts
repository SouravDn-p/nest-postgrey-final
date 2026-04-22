import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageMulterOptions } from 'src/config/multer.config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService ,
        private readonly cloudinaryService: CloudinaryService ,
        private readonly userService: UsersService
    ) {}

    @Post('register')
    @Public()
    @UseInterceptors(FileInterceptor('avatar', imageMulterOptions))
    async register(
        @Body() createUserDto : CreateUserDto,
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        const exist = await this.userService.findOne(createUserDto.email);
        if (exist) {
            throw new BadRequestException('User already exists');
        }
         let imageUrl: string | null = null;

        if (file) {
      const upload = await this.cloudinaryService.uploadFile(
        file,
        'nest-practice',
      );
         imageUrl = upload.url;
        }
        const user = await this.userService.create({ ...createUserDto, avatarUrl: imageUrl });
        
        return user;
    }

    @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<{ user: SafeUser }>> {
    const result = await this.authService.login(loginDto);

    res.cookie(
      'accessToken',
      result.accessToken,
      buildCookieOptions(ACCESS_MAX_AGE),
    );
    res.cookie(
      'refreshToken',
      result.refreshToken,
      buildCookieOptions(REFRESH_MAX_AGE),
    );

    return ApiResponse.success({ user: result.user });
  }
    

    
}
