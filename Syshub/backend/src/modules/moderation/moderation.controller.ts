import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModeratorRoleGuard } from '../auth/guards/moderator-role.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @UseGuards(JwtAuthGuard, ModeratorRoleGuard)
  @Post('hide')
  async hideContent(
    @Request() req,
    @Body('tipoContenido') tipoContenido: string,
    @Body('contenidoId') contenidoId: string,
    @Body('motivo') motivo: string
  ) {
    const userId = req.user.id;
    return this.moderationService.hideContent(userId, tipoContenido, contenidoId, motivo);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('restore')
  async restoreContent(
    @Request() req,
    @Body('tipoContenido') tipoContenido: string,
    @Body('contenidoId') contenidoId: string
  ) {
    const adminId = req.user.id;
    return this.moderationService.restoreContent(adminId, tipoContenido, contenidoId);
  }
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get('hidden-content')
  async getHiddenContent() {
    return this.moderationService.getHiddenContent();
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post('delete')
  async deleteContent(
    @Request() req,
    @Body('tipoContenido') tipoContenido: string,
    @Body('contenidoId') contenidoId: string
  ) {
    return this.moderationService.deleteContent(tipoContenido, contenidoId);
  }
}
