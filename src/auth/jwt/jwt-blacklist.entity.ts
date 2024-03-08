import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlacklistToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;
}
