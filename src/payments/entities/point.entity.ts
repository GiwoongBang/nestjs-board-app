import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { PointLog } from './point-log.entity';

@Entity()
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  availableAmount: number;

  @OneToOne(() => User, (user) => user.point)
  @JoinColumn()
  user: Relation<User>;

  @OneToMany(() => PointLog, (pointLog) => pointLog.amount)
  logs: Relation<PointLog[]>;

  use(amountToUse: number) {
    this.availableAmount -= amountToUse;
  }

  earn(amountToEarn: number) {
    this.availableAmount += amountToEarn;
  }
}
