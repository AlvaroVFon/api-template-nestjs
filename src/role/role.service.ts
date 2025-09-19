import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRespository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const newRole = this.roleRespository.create(createRoleDto);
    return this.roleRespository.save(newRole);
  }

  findAll() {
    return this.roleRespository.find();
  }

  async findOne(id: number): Promise<Role | null> {
    const role = await this.roleRespository.findOne({
      where: { id },
    });

    if (!role) return null;

    return role;
  }

  async findOneByName(name: string): Promise<Role | null> {
    const role = await this.roleRespository.findOne({
      where: { name },
    });

    if (!role) return null;

    return role;
  }

  async remove(id: number) {
    const result = await this.roleRespository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
