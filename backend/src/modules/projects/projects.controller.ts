import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return { message: 'Get all projects - implementar' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: `Get project ${id} - implementar` };
  }

  @Post()
  create(@Body() dto: any) {
    return { message: 'Create project - implementar' };
  }
}
