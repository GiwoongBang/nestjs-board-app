import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { email, password } = authCredentialDto;

    const user = new User();
    user.email = email;
    user.password = password;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 존재하는 Email 입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
