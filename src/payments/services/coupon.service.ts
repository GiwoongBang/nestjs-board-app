import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CouponRepository } from '../repositories/coupon.repository';
import { Coupon, CouponType } from '../entities/coupon.entity';
import { IssuedCoupon } from '../entities/issued-coupon.entity';
import { v4 as uuid } from 'uuid';
import { IssuedCouponRepository } from '../repositories/issued-coupon.repository';
import { User } from 'src/auth/user.entity';
import { CreateCouponDto } from '../dto/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly issuedCouponRepository: IssuedCouponRepository,
  ) {}

  @Transactional()
  async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const { name, type, value } = createCouponDto;
    const changedType = this.typeChanger(type);

    const coupon = new Coupon();
    coupon.name = name;
    coupon.type = changedType;
    coupon.value = value;

    return await this.couponRepository.save(coupon);
  }

  @Transactional()
  async issueCoupon(couponId: uuid, user: User): Promise<IssuedCoupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new BadRequestException(
        `쿠폰 정보를 확인할 수 없습니다. couponId: ${couponId}`,
      );
    }

    return this.issuedCouponRepository.issue(user, coupon);
  }

  typeChanger(type: string): CouponType {
    const lowerCaseType = type.toLowerCase();

    if (lowerCaseType === 'percent') {
      return 'percent';
    } else if (lowerCaseType === 'fixed') {
      return 'fixed';
    } else {
      throw new BadRequestException(`유효하지 않은 쿠폰 타입입니다: ${type}`);
    }
  }
}
