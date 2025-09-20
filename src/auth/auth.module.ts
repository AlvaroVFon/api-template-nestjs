import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PasswordStrategy } from './strategies/password.strategy';
import { TokenModule } from 'src/token/token.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordStrategy, GoogleStrategy],
})
export class AuthModule {}
