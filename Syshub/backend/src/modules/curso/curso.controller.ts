import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards, Request } from "@nestjs/common";
import { CursoService } from "./curso.service";
import { CarrerasService } from "../carreras/carreras.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

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
  return this.cursoService.findCursosByCarrera(id);
}


  ///  GET /api/v1/cursos/:id/estudiantes

  @Get('cursos/:id/estudiantes')
findEstudiantes(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.cursoService.findEstudiantesByCurso(id);
}


@UseGuards(JwtAuthGuard)
@Post(':id/inscribir')
inscribir(
  @Param('id', ParseUUIDPipe) cursoId: string,
  @Request() req: any,
  @Body() body: { ofertaId: string },
) {
  return this.cursoService.inscribirUsuario(cursoId, req.user.id ?? req.user.sub, body.ofertaId);
}

@UseGuards(JwtAuthGuard)
@Post('ofertas/:ofertaId/postular-docente')
postularDocente(
  @Param('ofertaId', ParseUUIDPipe) ofertaId: string,
  @Request() req: any,
  @Body() body?: { rolDocente?: 'docente' | 'auxiliar' },
) {
  return this.cursoService.postularDocente(ofertaId, req.user.id ?? req.user.sub, body?.rolDocente ?? 'docente');
}

@Get(':id/oferta')
getOferta(@Param('id', ParseUUIDPipe) id: string) {
  return this.cursoService.getOfertaCurso(id);
}

}