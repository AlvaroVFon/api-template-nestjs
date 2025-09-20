import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  public readonly type = 'google';
  constructor(private userService: UserService) {
    super({
      clientID: '',
      clientSecret: '',
      callbackURL: '',
      scope: ['email', 'profile'],
    });
  }

  //TODO: Generate upsert method at userService to use in validate
  async validate() {}
}
