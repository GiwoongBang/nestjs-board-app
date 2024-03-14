import { User } from 'src/auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Order } from './order.entity';

export type PgStatus = 'payment' | 'cancel';

@Entity()
export class PgConnection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  impUid: string;

  @Column()
  amount: number;

  @Column()
  status: PgStatus;

  @ManyToOne(() => User, (user) => user.pgConnects)
  user: Relation<User>;

  @ManyToOne(() => Order, (order) => order.pgConnects)
  order: Relation<Order>;

  @CreateDateColumn()
  createdAt: Date;
}
