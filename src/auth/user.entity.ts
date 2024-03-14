import { Board } from 'src/boards/board.entity';
import { IssuedCoupon } from 'src/payments/entities/issued-coupon.entity';
import { Order } from 'src/payments/entities/order.entity';
import { Point } from 'src/payments/entities/point.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  isSeller: boolean;

  @Column()
  refreshToken: string;

  @OneToMany(() => Board, (board) => board.user, { eager: true })
  boards: Relation<Board[]>;

  @OneToMany(() => Order, (order) => order.user)
  orders: Relation<Order[]>;

  @OneToMany(() => IssuedCoupon, (issuedCopon) => issuedCopon.user)
  issuedCoupons: Relation<IssuedCoupon[]>;

  @OneToOne(() => Point, (point) => point.user)
  point: Relation<IssuedCoupon[]>;
}
