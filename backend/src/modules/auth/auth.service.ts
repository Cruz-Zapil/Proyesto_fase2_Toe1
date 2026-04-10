import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string) {
    // TODO: Implementar registro
    return { message: 'Register - implementar' };
  }

  async login(email: string, password: string) {
    // TODO: Implementar login
    return { message: 'Login - implementar' };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
