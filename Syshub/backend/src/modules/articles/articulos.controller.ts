import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('articles')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Get()
  async getAll(@Body() body?: { publicadoOnly?: boolean }) {
    return this.articulosService.findAll(body?.publicadoOnly ?? true);
  }

  @Get('/etiquetas')
  async getEtiquetas() {
    return this.articulosService.getEtiquetas();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    await this.articulosService.incrementViews(id);
    return this.articulosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: any, @Body() dto: any) {
    return this.articulosService.create(req.user.id, dto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.articulosService.update(id, dto);
  }

  @Post('/:id/publish')
  @UseGuards(JwtAuthGuard)
  async publish(@Param('id') id: string) {
    await this.articulosService.publish(id);
    return this.articulosService.findOne(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.articulosService.delete(id);
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    const result = await this.articulosService.searchBySlug(slug);
    return result[0] || null;
  }
}
