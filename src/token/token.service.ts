import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/dto/authenticated.dto';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly jwtExp: number;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExp: number;

  constructor(private config: ConfigService) {
    this.jwtSecret = this.config.get<string>('jwtSecret') || 'secret';
    this.jwtExp = Number(this.config.get<number>('jwtExp'));
    this.jwtRefreshSecret =
      this.config.get<string>('jwtRefreshSecret') || 'yout_refresh_secret';
    this.jwtRefreshExp = Number(this.config.get<number>('jwtRefreshExp'));
  }

  generateTokens(user: AuthenticatedUser) {
    return {
      token: this.generateToken('access', user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  generateToken(type: string, user: AuthenticatedUser) {
    const payload = { type, user };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExp });
  }

  generateRefreshToken(user: AuthenticatedUser) {
    const payload = { type: 'refresh', user };
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExp,
    });
  }
}
