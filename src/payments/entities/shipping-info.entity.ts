import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Order } from './order.entity';

export type ShippingStatus =
  | 'ordered'
  | 'shipping'
  | 'shipped'
  | 'delivering'
  | 'delivered';

@Entity()
export class ShippingInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  status: ShippingStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shippingCompany: string;

  @OneToOne(() => Order, (order) => order.shippingInfo)
  order: Relation<Order>;
}
