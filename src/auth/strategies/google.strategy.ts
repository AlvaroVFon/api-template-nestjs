import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
import { AuthenticatedUser } from '../dto/authenticated.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { OAuthUserDto } from 'src/user/dto/create-oauth-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UserService,
    private config: ConfigService,
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
    if (!profile || !profile.emails) return;

    const OAuthUserDto: OAuthUserDto = this.prepareOAuthUserDto(profile);

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

    if (user) {
      const newOAuthUser = await this.userService.createOAuth({
        ...OAuthUserDto,
        userId: user.id,
      });

      return {
        id: newOAuthUser.id,
        email: newOAuthUser.email,
      } as AuthenticatedUser;
    }

    if (!user) {
      const newUser = await this.userService.createFromOAuth(
        profile.emails[0].value,
      );
      await this.userService.createOAuth({
        ...OAuthUserDto,
        userId: newUser.id,
      });

      return {
        id: newUser.id,
        email: newUser.email,
      } as AuthenticatedUser;
    }
  }

  prepareOAuthUserDto(profile: Profile): OAuthUserDto {
    if (!profile.emails) throw new Error('Invalid emails');
    return {
      email: profile.emails[0].value,
      provider: profile.provider,
      providerId: profile.id,
    };
  }
}
