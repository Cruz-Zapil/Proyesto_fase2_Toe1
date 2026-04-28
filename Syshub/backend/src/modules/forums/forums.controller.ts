import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
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
}