import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {
    super({
      // authModule은 Token 생성에 필요한 secretKey, jwtStrategy는 Token 검증에 사용하는 secretKey
      secretOrKey: 'koreaGodDeveloperGiWoong',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(paylaod) {
    const { email } = paylaod;
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (await this.authService.isTokenBlacklisted(paylaod.token)) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }

    return user;
  }
}
