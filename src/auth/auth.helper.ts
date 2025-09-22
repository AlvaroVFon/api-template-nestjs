import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { OAuthUserDto } from 'src/user/dto/create-oauth-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthenticatedUser } from './dto/authenticated.dto';

@Injectable()
export class AuthHelper {
  constructor(private userService: UserService) {}

  prepareOAuthUserDto(profile: Profile): OAuthUserDto {
    if (!profile.emails) throw new Error('Invalid emails');
    return {
      email: profile.emails[0].value,
      provider: profile.provider,
      providerId: profile.id,
    };
  }

  async validateOAuthUser(
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
