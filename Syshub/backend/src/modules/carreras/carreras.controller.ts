import { Controller, Get, Param } from '@nestjs/common';
import { CarrerasService } from './carreras.service';

@Controller('carreras')
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}

  // GET /api/v1/carreras
  // Lista todas las carreras activas — usado en el formulario de registro
  @Get()
  findAll() {
    return this.carrerasService.findAll();
  }

  // GET /api/v1/carreras/:id
  // Detalle de una carrera
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carrerasService.findOne(id);
  }

  // GET /api/v1/carreras/:id/cursos
  // Cursos asociados a una carrera
  @Get(':id/cursos')
  findCursos(@Param('id') id: string) {
    return this.carrerasService.findCursosByCarrera(id);
  }
}