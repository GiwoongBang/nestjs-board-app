import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { IssuedCoupon } from './issued-coupon.entity';
import { v4 as uuid } from 'uuid';

export type CouponType = 'percent' | 'fixed';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: CouponType;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  value: number;

  @OneToMany(() => IssuedCoupon, (issuedCoupon) => issuedCoupon.coupon)
  issuedCoupons: Relation<IssuedCoupon[]>;
}
