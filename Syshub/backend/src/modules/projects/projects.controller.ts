import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // GET público — lista de proyectos publicados
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // GET público — lista de áreas técnicas para filtros y formularios
  @Get('areas-tecnicas')
  getAreasTecnicas() {
    return this.projectsService.getAreasTecnicas();
  }

  // GET público — lista de etiquetas
  @Get('etiquetas')
  getEtiquetas() {
    return this.projectsService.getEtiquetas();
  }

  // GET público — lista de tecnologías
  @Get('tecnologias')
  getTecnologias() {
    return this.projectsService.getTecnologias();
  }

  // GET protegido — cursos asociados al usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('mis-cursos')
  getMisCursos(@Request() req: any) {
    return this.projectsService.getCursosForUser(req.user.id);
  }

  // GET público — detalle de un proyecto
  @Get(':id([0-9a-fA-F-]{36})')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // POST protegido — solo usuarios autenticados pueden crear proyectos
  // El autorId se extrae del token, no del body
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.projectsService.create({
      ...body,
      autorId: req.user.id, // ← viene del token JWT
    });
  }

  // PUT protegido — solo el autor puede editar
  @UseGuards(JwtAuthGuard)
  @Put(':id([0-9a-fA-F-]{36})')
  update(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.update(id, body);
  }

  // DELETE protegido — solo el autor puede archivar
  @UseGuards(JwtAuthGuard)
  @Delete(':id([0-9a-fA-F-]{36})')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
