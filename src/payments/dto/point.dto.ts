import { IsNotEmpty } from 'class-validator';

export class PointDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  reason: string;
}
