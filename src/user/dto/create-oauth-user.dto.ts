import { IsOptional, IsPositive, IsString } from 'class-validator';

export class OAuthUserDto {
  @IsString()
  email: string;

  @IsString()
  provider: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsPositive()
  userId?: number;
}
