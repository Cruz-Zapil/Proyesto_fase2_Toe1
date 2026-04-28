import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // GET público — cualquiera puede ver proyectos publicados
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // GET público — detalle de un proyecto
  @Get(':id')
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
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.update(id, body);
  }

  // DELETE protegido — solo el autor puede archivar
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}