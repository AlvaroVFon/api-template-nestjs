import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { UserService } from 'src/user/user.service';
import { OAuthUserDto } from 'src/user/dto/create-oauth-user.dto';
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
    if (!profile || !profile.emails) return;

    const OAuthUserDto: OAuthUserDto =
      this.authHelper.prepareOAuthUserDto(profile);

    const oAuthUser = await this.userService.findOAuthByProvider(
      profile.id,
      profile.provider,
    );

    if (oAuthUser && oAuthUser.user) {
      return {
        id: oAuthUser.user.id,
        email: oAuthUser.email,
      } as AuthenticatedUser;
    }

    const user = await this.userService.findOneByEmail(profile.emails[0].value);

    if (!oAuthUser && user) {
      const newOAuthUser = await this.userService.createOAuth({
        ...OAuthUserDto,
        user,
      });

      return {
        id: newOAuthUser.id,
        email: newOAuthUser.email,
      } as AuthenticatedUser;
    }

    if (!user && !oAuthUser) {
      const newUser = await this.userService.createFromOAuth(
        profile.emails[0].value,
      );

      await this.userService.createOAuth({
        ...OAuthUserDto,
        user: newUser,
      });

      return {
        id: newUser.id,
        email: newUser.email,
      } as AuthenticatedUser;
    }
  }
}
