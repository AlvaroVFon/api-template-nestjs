import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class OAuthUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @PrimaryColumn()
  provider: string;

  @Column()
  @PrimaryColumn()
  providerId: string;

  @ManyToOne(() => User, (user) => user.oAuthUsers)
  @JoinColumn({ name: 'user_id' })
  @IsOptional()
  user: User;
}
