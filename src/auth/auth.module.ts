import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PasswordStrategy } from './strategies/password.strategy';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordStrategy],
})
export class AuthModule {}
