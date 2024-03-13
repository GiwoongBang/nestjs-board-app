import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IssuedCoupon } from '../entities/issued-coupon.entity';
import { User } from 'src/auth/user.entity';
import { Coupon } from '../entities/coupon.entity';

@Injectable()
export class IssuedCouponRepository extends Repository<IssuedCoupon> {
  constructor(
    @InjectRepository(IssuedCoupon)
    private readonly issuedCouponRepository: Repository<IssuedCoupon>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      issuedCouponRepository.target,
      issuedCouponRepository.manager,
      issuedCouponRepository.queryRunner,
    );
  }

  async issue(user: User, coupon: Coupon): Promise<IssuedCoupon> {
    const issuedCoupon = new IssuedCoupon();
    issuedCoupon.validFrom = new Date();
    issuedCoupon.validUntil = new Date();
    issuedCoupon.validUntil.setDate(issuedCoupon.validUntil.getDate() + 7);
    issuedCoupon.user = user;
    issuedCoupon.coupon = coupon;

    return await this.issuedCouponRepository.save(issuedCoupon);
  }

  use(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon> {
    issuedCoupon.use();
    return this.save(issuedCoupon);
  }
}
