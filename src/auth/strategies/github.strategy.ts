import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { UserService } from 'src/user/user.service';
import { AuthHelper } from '../auth.helper';
import { AuthenticatedUser } from '../dto/authenticated.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private userService: UserService,
    private config: ConfigService,
    private authHelper: AuthHelper,
  ) {
    super({
      clientID: config.get<string>('githubClientId') || '',
      clientSecret: config.get<string>('githubClientSecret') || '',
      callbackURL: config.get<string>('githubCallbackURL') || '',
      scope: ['user:email'],
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
