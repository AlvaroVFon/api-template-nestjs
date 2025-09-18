import { PipeTransform, Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../user.service';

@Injectable()
export class UserExistPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: CreateUserDto) {
    const email = value.email;

    const exists = await this.userService.findOneByEmail(email);

    if (exists) {
      throw new ConflictException(`User with email: ${email} already exists`);
    }

    return value;
  }
}
