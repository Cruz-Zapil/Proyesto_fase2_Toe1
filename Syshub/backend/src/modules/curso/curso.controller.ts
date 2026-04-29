import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { CursoService } from "./curso.service";
import { CarrerasService } from "../carreras/carreras.service";

@Controller('cursos')
export class CursoController {
    
  constructor(private readonly cursoService: CursoService, private readonly carrerasService: CarrerasService) {}

  // GET /api/v1/cursos/:id
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cursoService.findById(id);
  }

  // GET /api/v1/carreras/:id/cursos
@Get('carreras/:id/cursos')
findCursos(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.carrerasService.findCursosByCarrera(id);
}


}