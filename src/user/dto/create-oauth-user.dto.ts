import { IsOptional, IsPositive, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class OAuthUserDto {
  @IsString()
  email: string;

  @IsString()
  provider: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsPositive()
  user?: User;
}
