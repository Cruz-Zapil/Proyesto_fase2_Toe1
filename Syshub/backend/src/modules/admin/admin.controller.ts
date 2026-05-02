import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { EstadoUsuario } from '../users/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminRoleGuard) // todas las rutas de admin requieren JWT + rol admin
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

  // PUT /api/v1/admin/users/:id/estado
  @Put('users/:id/estado')
  updateUserState(
    @Param('id') id: string,
    @Body() body: { estado: EstadoUsuario; adminPassword?: string },
    @Req() req: any,
  ) {
    return this.adminService.updateUserState(id, body.estado, req.user.id, body.adminPassword);
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

  // POST /api/v1/admin/curso-ofertas
  @Post('curso-ofertas')
  createCursoOferta(
    @Body()
    body: {
      cursoId: string;
      seccion?: string;
      cicloAcademico?: string;
      anioAcademico?: number;
      cupo?: number;
    },
  ) {
    return this.adminService.createCursoOferta(body);
  }

  // GET /api/v1/admin/curso-ofertas
  @Get('curso-ofertas')
  listCursoOfertas() {
    return this.adminService.listCursoOfertas();
  }

  // GET /api/v1/admin/postulaciones-docentes
  @Get('postulaciones-docentes')
  listPostulacionesDocentesPendientes() {
    return this.adminService.listPostulacionesDocentesPendientes();
  }

  // PUT /api/v1/admin/postulaciones-docentes/:id/aprobar
  @Put('postulaciones-docentes/:id/aprobar')
  aprobarPostulacionDocente(@Param('id') id: string) {
    return this.adminService.aprobarPostulacionDocente(id);
  }

  // PUT /api/v1/admin/postulaciones-docentes/:id/rechazar
  @Put('postulaciones-docentes/:id/rechazar')
  rechazarPostulacionDocente(@Param('id') id: string) {
    return this.adminService.rechazarPostulacionDocente(id);
  }

  // GET /api/v1/admin/solicitudes-estudiantes
  @Get('solicitudes-estudiantes')
  listSolicitudesEstudiantesPendientes() {
    return this.adminService.listSolicitudesEstudiantesPendientes();
  }

  // PUT /api/v1/admin/solicitudes-estudiantes/:id/aprobar
  @Put('solicitudes-estudiantes/:id/aprobar')
  aprobarSolicitudEstudiante(@Param('id') id: string) {
    return this.adminService.aprobarSolicitudEstudiante(id);
  }

  // PUT /api/v1/admin/solicitudes-estudiantes/:id/rechazar
  @Put('solicitudes-estudiantes/:id/rechazar')
  rechazarSolicitudEstudiante(@Param('id') id: string) {
    return this.adminService.rechazarSolicitudEstudiante(id);
  }
}