import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';
import { validatePassword } from 'src/common/helpers/crypto.helper';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../dto/authenticated.dto';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy, 'password') {
  public readonly type = 'password';

  constructor(private userService: UserService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !user.password) throw new UnauthorizedException();

    const isValidPassword = await validatePassword(password, user.password);

    if (!isValidPassword) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
    };
  }
}
