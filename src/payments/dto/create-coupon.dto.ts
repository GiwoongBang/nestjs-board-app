import { IsNotEmpty } from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  value: number;
}
