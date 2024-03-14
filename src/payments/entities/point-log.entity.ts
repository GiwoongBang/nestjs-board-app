import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Point } from './point.entity';

export type PointLogType = 'earn' | 'spend';

@Entity()
export class PointLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'varchar', length: 50 })
  type: PointLogType;

  @ManyToOne(() => Point, (point) => point.logs)
  point: Relation<Point>;

  earn(amount: number, reason: string): void {
    this.amount = amount;
    this.reason = reason;
    this.type = 'earn';
  }

  use(amount: number, reason: string): void {
    this.amount = amount;
    this.reason = reason;
    this.type = 'spend';
  }
}
