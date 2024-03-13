import { IsNotEmpty } from 'class-validator';
import { CouponType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: CouponType;

  @IsNotEmpty()
  value: number;
}
