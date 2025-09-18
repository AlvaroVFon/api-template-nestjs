import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ConflictException,
} from '@nestjs/common';
import { RoleService } from '../role.service';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class RoleExistsPipe implements PipeTransform {
  constructor(private roleService: RoleService) {}

  async transform(value: CreateRoleDto, metadata: ArgumentMetadata) {
    const role = value.name;

    console.log(metadata);
    const exists = await this.roleService.findOneByName(role);

    if (exists) throw new ConflictException(`Role '${role} already exists'`);
  }
}
