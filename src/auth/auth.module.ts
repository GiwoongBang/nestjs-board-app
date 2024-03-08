import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { BlacklistTokenRepository } from './jwt/jwt-blacklist.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'koreaGodDeveloperGiWoong',
      signOptions: {
        expiresIn: 60 * 30, // AccessToken: 30분
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    BlacklistTokenRepository,
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
