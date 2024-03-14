import { IsNotEmpty } from 'class-validator';

export class PgConnectionDto {
  @IsNotEmpty()
  impUid: string;

  @IsNotEmpty()
  amount: number;
}
