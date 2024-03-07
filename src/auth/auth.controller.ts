import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { CustomValidationPipe } from './pipes/user-signup-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(CustomValidationPipe)
  async createUser(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    return this.authService.createUser(authCredentialDto);
  }

  @Post('/signin')
  @UsePipes(CustomValidationPipe)
  async signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<string> {
    return this.authService.signIn(authCredentialDto);
  }
}
