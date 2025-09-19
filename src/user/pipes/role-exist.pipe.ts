import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { RoleService } from 'src/role/role.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class RoleExistsPipe implements PipeTransform {
  constructor(private readonly roleService: RoleService) {}

  async transform(value: CreateUserDto) {
    const role = value.roleId;

    const exists = await this.roleService.findOne(role);

    if (!exists) {
      throw new BadRequestException(`El role "${role}" no existe`);
    }

    return value;
  }
}
