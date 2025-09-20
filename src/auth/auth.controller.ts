import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './dto/authenticated.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/password')
  @UseGuards(AuthGuard('password'))
  login(@Req() req: Express.Request) {
    return this.authService.login(req.user as AuthenticatedUser);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  loginWithGoogle(@Req() req: Express.Request) {
    return this.authService.login(req.user as AuthenticatedUser);
  }
}
