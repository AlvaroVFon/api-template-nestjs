import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
import { AuthenticatedUser } from '../dto/authenticated.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UserService,
    private config: ConfigService,
    private authHelper: AuthHelper,
  ) {
    super({
      clientID: config.get<string>('googleClientId') || '',
      clientSecret: config.get<string>('googleClientSecret') || '',
      callbackURL: config.get<string>('googleCallbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<AuthenticatedUser | undefined> {
    return this.authHelper.validateOAuthUser(profile);
  }
}
