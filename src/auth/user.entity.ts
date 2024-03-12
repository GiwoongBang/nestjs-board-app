import { Board } from 'src/boards/board.entity';
import { Order } from 'src/payments/entities/order.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
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
  boards: Board[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
