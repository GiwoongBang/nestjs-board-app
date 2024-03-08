import { Board } from 'src/boards/board.entity';
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
  refreshToken: string;

  // @OneToMany(type => Board, board => board.user, { eager: true })
  @OneToMany(() => Board, (board) => board.user, { eager: true })
  boards: Board[];
}
