import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { IssuedCoupon } from './issued-coupon.entity';
import { UUID } from 'crypto';

export type CouponType = 'percent' | 'fixed';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: UUID;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: CouponType;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number;

  @OneToMany(() => IssuedCoupon, (issuedCoupon) => issuedCoupon.coupon)
  issuedCoupons: Relation<IssuedCoupon[]>;
}
