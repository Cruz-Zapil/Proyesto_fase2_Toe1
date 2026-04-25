import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ForumsService } from './forums.service';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  // GET /api/v1/forums/threads
  // Lista todos los hilos abiertos
  @Get('threads')
  findAllHilos() {
    return this.forumsService.findAllHilos();
  }

  // GET /api/v1/forums/threads/:id
  // Detalle de un hilo con sus datos
  @Get('threads/:id')
  findOneHilo(@Param('id') id: string) {
    return this.forumsService.findOneHilo(id);
  }

  // POST /api/v1/forums/threads
  // Crea un hilo nuevo
  // Body: { titulo, contenido, autorId, cursoId?, categoria? }
  @Post('threads')
  createHilo(@Body() body: any) {
    return this.forumsService.createHilo(body);
  }

  // GET /api/v1/forums/threads/:id/comments
  // Lista comentarios visibles de un hilo
  @Get('threads/:id/comments')
  findComentarios(@Param('id') id: string) {
    return this.forumsService.findComentariosByHilo(id);
  }

  // POST /api/v1/forums/threads/:id/comments
  // Agrega un comentario a un hilo
  // Body: { contenido, usuarioId, padreId? }
  @Post('threads/:id/comments')
  createComentario(@Param('id') id: string, @Body() body: any) {
    return this.forumsService.createComentario(id, body);
  }
}