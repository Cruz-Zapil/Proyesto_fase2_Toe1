import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

// TODO: Implementar DTOs y Guards
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: any) {
    return { message: 'Register endpoint - implementar' };
  }

  @Post('login')
  login(@Body() dto: any) {
    return { message: 'Login endpoint - implementar' };
  }

  @Get('me')
  getMe() {
    return { message: 'Get current user - implementar' };
  }
}
