import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class OAuthUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  provider: string;

  @Column()
  providerId: string;

  @ManyToOne(() => User, (user) => user.oAuthUsers)
  @JoinColumn({ name: 'user_id' })
  @IsOptional()
  user: User;
}
