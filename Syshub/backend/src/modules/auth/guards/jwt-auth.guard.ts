import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Al extender AuthGuard('jwt'), NestJS automáticamente
// usa JwtStrategy para validar el token antes de entrar al endpoint
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}