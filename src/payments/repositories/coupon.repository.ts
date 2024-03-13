import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '../entities/coupon.entity';
import { CreateCouponDto } from '../dto/create-coupon.dto';

@Injectable()
export class CouponRepository extends Repository<Coupon> {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      couponRepository.target,
      couponRepository.manager,
      couponRepository.queryRunner,
    );
  }

  async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const { name, type, value } = createCouponDto;

    const coupon = new Coupon();
    coupon.name = name;
    coupon.type = type;
    coupon.value = value;

    return this.couponRepository.save(coupon);
  }
}
