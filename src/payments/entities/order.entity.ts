import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { IssuedCoupon } from './issued-coupon.entity';
import { User } from 'src/auth/user.entity';
import { OrderItem } from './order-item.entity';
import { ShippingInfo } from './shipping-info.entity';
import { PgConnection } from './pg.entity';

export type OrderStatus = 'started' | 'paid' | 'refunded';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  orderNo: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  amount: number;

  @Column({ type: 'varchar', length: 100 })
  status: OrderStatus;

  @Column({ type: 'int', default: 0 })
  pointAmountUsed: number;

  @Column({ type: 'text', nullable: true })
  refundReason: string;

  @Column({ type: 'decimal', nullable: true })
  refundedAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: Relation<User>;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: Relation<OrderItem[]>;

  @OneToMany(() => PgConnection, (pgConnection) => pgConnection.order)
  pgConnects: PgConnection[];

  @OneToOne(() => IssuedCoupon, (issuedCoupon) => issuedCoupon.usedOrder, {
    nullable: true,
  })
  @JoinColumn()
  usedIssuedCoupon: Relation<IssuedCoupon>;

  @OneToOne(() => ShippingInfo, (shippingInfo) => shippingInfo.order, {
    nullable: true,
  })
  @JoinColumn()
  shippingInfo: Relation<ShippingInfo>;

  constructor() {
    super();
    this.setOrderNo();
  }

  setOrderNo() {
    const date = new Date();
    const dateFormat = `${date.getFullYear()}
                        ${String(date.getMonth() + 1).padStart(2, '0')}
                        ${String(date.getDate()).padStart(2, '0')}
                        ${String(date.getHours()).padStart(2, '0')}
                        ${String(date.getMinutes()).padStart(2, '0')}
                        ${String(date.getSeconds()).padStart(2, '0')}`;
    const randomString = Array.from(
      { length: 15 },
      () => Math.random().toString(36)[2] || '0',
    ).join('');
    this.orderNo = `${dateFormat}_${randomString.toUpperCase()}`;
  }
}
