import { Controller, Get, Post, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  // GET público — cualquiera puede ver los hilos
  @Get('threads')
  findAllHilos() {
    return this.forumsService.findAllHilos();
  }

  // GET público — etiquetas disponibles para hilos
  @Get('etiquetas')
  getEtiquetas() {
    return this.forumsService.getEtiquetas();
  }

  // GET protegido — cursos inscritos del estudiante autenticado
  @UseGuards(JwtAuthGuard)
  @Get('mis-cursos-inscritos')
  getMisCursosInscritos(@Request() req: any) {
    return this.forumsService.getCursosInscritos(req.user.id);
  }

  // GET público — detalle de un hilo
  @Get('threads/:id')
  findOneHilo(@Param('id') id: string) {
    return this.forumsService.findOneHilo(id);
  }

  // POST protegido — autorId viene del token
  @UseGuards(JwtAuthGuard)
  @Post('threads')
  createHilo(@Body() body: any, @Request() req: any) {
    return this.forumsService.createHilo({
      ...body,
      autorId: req.user.id, // ← viene del token JWT
    });
  }

  // GET público — comentarios de un hilo
  @Get('threads/:id/comments')
  findComentarios(@Param('id') id: string) {
    return this.forumsService.findComentariosByHilo(id);
  }

  // POST protegido — usuarioId viene del token
  @UseGuards(JwtAuthGuard)
  @Post('threads/:id/comments')
  createComentario(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.forumsService.createComentario(id, {
      ...body,
      usuarioId: req.user.id, // ← viene del token JWT
    });
  }

  // Votar hilo
  @UseGuards(JwtAuthGuard)
  @Post('threads/:id/vote')
  voteThread(@Param('id') id: string, @Body('vote') vote: number, @Request() req: any) {
    if (vote !== 1 && vote !== -1) {
      throw new BadRequestException('El voto debe ser 1 o -1');
    }

    return this.forumsService.voteThread(id, req.user.id, vote);
  }

  // Alias para simplificar la UI: like/dislike sobre hilo
  @UseGuards(JwtAuthGuard)
  @Post('threads/:id/like')
  likeThread(@Param('id') id: string, @Request() req: any) {
    return this.forumsService.voteThread(id, req.user.id, 1);
  }

  @UseGuards(JwtAuthGuard)
  @Post('threads/:id/dislike')
  dislikeThread(@Param('id') id: string, @Request() req: any) {
    return this.forumsService.voteThread(id, req.user.id, -1);
  }

  // Votar comentario
  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/vote')
  voteComment(@Param('id') id: string, @Body('vote') vote: number, @Request() req: any) {
    if (vote !== 1 && vote !== -1) {
      throw new BadRequestException('El voto debe ser 1 o -1');
    }

    return this.forumsService.voteComment(id, req.user.id, vote);
  }

  // Alias para simplificar la UI: like/dislike sobre comentario
  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/like')
  likeComment(@Param('id') id: string, @Request() req: any) {
    return this.forumsService.voteComment(id, req.user.id, 1);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/dislike')
  dislikeComment(@Param('id') id: string, @Request() req: any) {
    return this.forumsService.voteComment(id, req.user.id, -1);
  }
}