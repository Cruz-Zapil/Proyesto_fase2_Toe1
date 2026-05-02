import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards } from '@nestjs/common';
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

  // GET /api/v1/admin/divisions
  @Get('divisions')
  findDivisions() {
    return this.adminService.findDivisions();
  }

  // GET /api/v1/admin/carreras
  @Get('carreras')
  findCarreras() {
    return this.adminService.findCarreras();
  }

  // GET /api/v1/admin/cursos
  @Get('cursos')
  findCursos() {
    return this.adminService.findCursos();
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

  // POST /api/v1/admin/divisions
  @Post('divisions')
  createDivision(@Body() body: { codigo: string; nombre: string; descripcion?: string }) {
    return this.adminService.createDivision(body);
  }

  // POST /api/v1/admin/carreras
  @Post('carreras')
  createCarrera(
    @Body() body: { nombre: string; codigo?: string; facultad?: string; divisionId: string },
  ) {
    return this.adminService.createCarrera(body);
  }

  // POST /api/v1/admin/cursos
  @Post('cursos')
  createCurso(
    @Body()
    body: {
      nombre: string;
      codigo: string;
      semestre: number;
      descripcion?: string;
      carreraId: string;
      activo?: boolean;
    },
  ) {
    return this.adminService.createCurso(body);
  }
}