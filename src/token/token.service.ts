import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { AuthenticatedUser } from 'src/auth/dto/authenticated.dto';
import { TokenType } from 'src/common/enums/token-type.enum';

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
      token: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  generateToken(
    type: string,
    payload: any,
    exp: number,
    secret: string,
  ): string {
    return jwt.sign({ ...payload, type }, secret, { expiresIn: exp });
  }

  generateAccessToken(user: AuthenticatedUser): string {
    return this.generateToken(
      TokenType.ACCESS,
      user,
      this.jwtExp,
      this.jwtSecret,
    );
  }

  generateRefreshToken(user: AuthenticatedUser) {
    return this.generateToken(
      TokenType.REFRESH,
      user,
      this.jwtRefreshExp,
      this.jwtRefreshSecret,
    );
  }
}
