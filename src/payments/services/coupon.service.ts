import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UserRepository } from 'src/auth/user.repository';
import { CouponRepository } from '../repositories/coupon.repository';
import { Coupon } from '../entities/coupon.entity';
import { IssuedCoupon } from '../entities/issued-coupon.entity';
import { UUID } from 'crypto';
import { IssuedCouponRepository } from '../repositories/issued-coupon.repository';

@Injectable()
export class CouponService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly couponRepository: CouponRepository,
    private readonly issuedCouponRepository: IssuedCouponRepository,
  ) {}

  @Transactional()
  async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const { type } = createCouponDto;

    if (type.toUpperCase() !== 'PERCENT' || type.toUpperCase() === 'FIXED') {
      throw new BadRequestException(
        `쿠폰 타입이 유효하지 않습니다. Coupon Type: ${type}`,
      );
    }

    return await this.couponRepository.createCoupon(createCouponDto);
  }

  @Transactional()
  async issueCoupon(couponId: UUID, userId: string): Promise<IssuedCoupon> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) },
    });

    const coupon = await this.couponRepository.findOne({
      where: { id: couponId },
    });

    if (!user || !coupon) {
      throw new BadRequestException(
        `유저 또는 쿠폰 정보를 확인할 수 없습니다. userId: ${userId} couponId: ${couponId}`,
      );
    }

    return this.issuedCouponRepository.issue(user, coupon);
  }
}
