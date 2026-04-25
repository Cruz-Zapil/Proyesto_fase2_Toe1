import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // GET /api/v1/projects — lista proyectos publicados
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // GET /api/v1/projects/:id — detalle de un proyecto
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // POST /api/v1/projects — crear proyecto
  // Body: { titulo, descripcion, cursoId, stackTecnologico, autorId }
  @Post()
  create(@Body() body: any) {
    return this.projectsService.create(body);
  }

  // PUT /api/v1/projects/:id — editar proyecto
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.update(id, body);
  }

  // DELETE /api/v1/projects/:id — archivar proyecto
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}