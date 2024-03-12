import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { CustomValidationPipe } from './pipes/user-signup-validation.pipe';
import { UserSginUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(CustomValidationPipe)
  async createUser(
    @Body() userSginUpDto: UserSginUpDto,
    @Body() AuthCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signUp(userSginUpDto, AuthCredentialDto);
  }

  @Post('/signin')
  @UsePipes(CustomValidationPipe)
  async signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(authCredentialDto);
  }

  @Post('/refresh')
  async reissueAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.reissueAccessToken(refreshToken);
  }

  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Body('refreshToken') refreshToken: string,
  ): Promise<void> {
    const accessToken = req.headers['authorization'].split(' ')[1];

    await this.authService.logout(accessToken, refreshToken);
  }
}
