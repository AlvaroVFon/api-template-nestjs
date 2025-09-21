import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PasswordStrategy } from './strategies/password.strategy';
import { TokenModule } from 'src/token/token.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { AuthHelper } from './auth.helper';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    PasswordStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
})
export class AuthModule {}
