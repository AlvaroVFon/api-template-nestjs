import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/common/helpers/crypto.helper';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const role = await this.roleService.findOne(+createUserDto.roleId);
    if (!role) return null;

    createUserDto.password = await hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
      role,
    });

    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.userRepository.delete(id);
    if (!result.affected) throw new NotFoundException();

    return result;
  }
}
