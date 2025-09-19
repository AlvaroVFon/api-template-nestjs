import { Role } from 'src/role/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role: Role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
