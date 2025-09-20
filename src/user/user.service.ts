import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/common/helpers/crypto.helper';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { RoleService } from 'src/role/role.service';
import { OAuthUser } from './entities/oAuth-user.entity';
import { OAuthUserDto } from './dto/create-oauth-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OAuthUser) private oauthRepository: Repository<OAuthUser>,
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

  async createFromOAuth(email: string) {
    const user = this.userRepository.create({ email });
    return this.userRepository.save(user);
  }

  createOAuth(oAuthUserDto: OAuthUserDto) {
    const oAuthUser = this.oauthRepository.create(oAuthUserDto);
    return this.oauthRepository.save(oAuthUser);
  }

  async findOAuthByProvider(
    providerId: string,
    provider: string,
  ): Promise<OAuthUser | null> {
    return this.oauthRepository.findOne({
      where: { provider, providerId },
      loadRelationIds: true,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.userRepository.delete(id);
    if (!result.affected) throw new NotFoundException();

    return result;
  }
}
