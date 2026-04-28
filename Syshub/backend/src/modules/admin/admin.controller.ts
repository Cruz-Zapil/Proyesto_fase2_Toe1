import { Controller, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard) // todas las rutas de admin requieren JWT
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /api/v1/admin/pendientes
  // Lista estudiantes esperando aprobación
  @Get('pendientes')
  findPendientes() {
    return this.adminService.findPendientes();
  }

  // GET /api/v1/admin/users
  // Lista todos los usuarios
  @Get('users')
  findAll() {
    return this.adminService.findAll();
  }

  // PUT /api/v1/admin/users/:id/aprobar
  // Moderador aprueba un estudiante
  @Put('users/:id/aprobar')
  aprobar(@Param('id') id: string) {
    return this.adminService.aprobar(id);
  }

  // PUT /api/v1/admin/users/:id/rechazar
  // Moderador rechaza un estudiante
  @Put('users/:id/rechazar')
  rechazar(@Param('id') id: string) {
    return this.adminService.rechazar(id);
  }
}