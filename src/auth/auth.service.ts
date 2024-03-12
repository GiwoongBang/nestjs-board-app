import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { BlacklistTokenRepository } from './jwt/jwt-blacklist.repository';
import { UserSginUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly blacklistTokenRepository: BlacklistTokenRepository,
  ) {}

  async signUp(
    userSginUpDto: UserSginUpDto,
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, name, address, isSeller } = userSginUpDto;

    const hashedPassword = await argon2.hash(password);
    const payload = { email };

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.name = name;
    user.address = address;
    user.isSeller = isSeller;
    user.refreshToken = this.jwtService.sign(payload);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 존재하는 Email 입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }

    const result = await this.signIn(authCredentialDto);
    return result;
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = authCredentialDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }

    const payload = { email };
    const accessToken = this.jwtService.sign(payload);

    let refreshToken = '';
    try {
      this.jwtService.verify(user.refreshToken);
      refreshToken = user.refreshToken;
    } catch (error) {
      await this.reissuseRefreshToken(email);
      refreshToken = user.refreshToken;
    }

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async reissueAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { email } = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { email } });

      const payload = { email };
      const accessToken = this.jwtService.sign(payload);
      refreshToken = this.jwtService.sign(payload, {
        expiresIn: 60 * 60 * 24 * 30,
      });
      user.refreshToken = refreshToken;

      return { accessToken: accessToken, refreshToken: refreshToken };
    } catch (error) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }
  }

  async reissuseRefreshToken(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    const payload = { email };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    this.blacklistTokenRepository.create({ token: accessToken });
    this.blacklistTokenRepository.create({ token: refreshToken });

    const { email } = this.jwtService.verify(refreshToken);
    const payload = { email };

    const user = await this.userRepository.findOne({ where: { email } });
    user.refreshToken = this.jwtService.sign(payload, {
      expiresIn: 60 * 60 * 24 * 30,
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistTokenRepository.findOne({
      where: { token },
    });
    return !!blacklistedToken;
  }
}
