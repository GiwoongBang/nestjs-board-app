import { IsNotEmpty } from 'class-validator';

export class UserSginUpDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  isSeller: boolean;
}
