import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { OAuthUserDto } from 'src/user/dto/create-oauth-user.dto';
import { UserService } from 'src/user/user.service';

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
}
