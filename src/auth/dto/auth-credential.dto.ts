import { IsEmail, Matches } from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  email: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  password: string;
}
