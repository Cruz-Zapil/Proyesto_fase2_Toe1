import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.rolId) {
      throw new UnauthorizedException('Token inválido');
    }

    const result = await this.dataSource.query(
      `
      SELECT nombre
      FROM roles
      WHERE id = $1
      LIMIT 1
      `,
      [user.rolId],
    );

    const roleName = String(result?.[0]?.nombre || '').trim().toLowerCase();
    const isAdmin = roleName === 'admin' || roleName === 'administrador' || roleName.includes('admin');

    if (!isAdmin) {
      throw new ForbiddenException('No tienes permisos de administrador');
    }

    return true;
  }
}