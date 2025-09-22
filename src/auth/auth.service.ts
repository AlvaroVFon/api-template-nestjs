import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthenticatedUser } from './dto/authenticated.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  login(user: AuthenticatedUser) {
    return this.tokenService.generateTokens(user);
  }
}
