import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // GET público — lista de proyectos publicados
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // GET público — lista de áreas técnicas para filtros y formularios
  @Get('areas-tecnicas')
  getAreasTecnicas() {
    return this.projectsService.getAreasTecnicas();
  }

  // GET público — lista de etiquetas
  @Get('etiquetas')
  getEtiquetas() {
    return this.projectsService.getEtiquetas();
  }

  // GET público — lista de tecnologías
  @Get('tecnologias')
  getTecnologias() {
    return this.projectsService.getTecnologias();
  }

  // GET protegido — cursos asociados al usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('mis-cursos')
  getMisCursos(@Request() req: any) {
    return this.projectsService.getCursosForUser(req.user.id);
  }

  // GET público — detalle de un proyecto
  @Get(':id([0-9a-fA-F-]{36})')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // POST protegido — solo usuarios autenticados pueden crear proyectos
  // El autorId se extrae del token, no del body
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.projectsService.create({
      ...body,
      autorId: req.user.id, // ← viene del token JWT
    });
  }

  // PUT protegido — solo el autor puede editar
  @UseGuards(JwtAuthGuard)
  @Put(':id([0-9a-fA-F-]{36})')
  update(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.update(id, body);
  }

  // DELETE protegido — solo el autor puede archivar
  @UseGuards(JwtAuthGuard)
  @Delete(':id([0-9a-fA-F-]{36})')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // POST protegido — subir archivo para un proyecto (propietario)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const projectId = req.params.id;
          const dir = `uploads/projects/${projectId}`;
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.random().toString(36).substring(2, 8);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post(':id([0-9a-fA-F-]{36})/files')
  async uploadFile(@Param('id') id: string, @UploadedFile() file: any, @Request() req: any) {
    if (!file) throw new BadRequestException('No se recibió archivo');

    const isOwner = await this.projectsService.isProjectOwner(id, req.user.id);
    if (!isOwner) throw new BadRequestException('No autorizado para subir archivos a este proyecto');

    const url = `/uploads/projects/${id}/${file.filename}`;
    const saved = await this.projectsService.saveArchivo(id, file.originalname, url, file.mimetype, file.size);
    return saved;
  }

  // GET público — lista archivos de un proyecto
  @Get(':id([0-9a-fA-F-]{36})/files')
  listFiles(@Param('id') id: string) {
    return this.projectsService.listArchivos(id);
  }

  // DELETE protegido — eliminar archivo (propietario)
  @UseGuards(JwtAuthGuard)
  @Delete(':projectId([0-9a-fA-F-]{36})/files/:fileId([0-9a-fA-F-]{36})')
  async deleteFile(@Param('projectId') projectId: string, @Param('fileId') fileId: string, @Request() req: any) {
    const isOwner = await this.projectsService.isProjectOwner(projectId, req.user.id);
    if (!isOwner) throw new BadRequestException('No autorizado para eliminar este archivo');

    return this.projectsService.removeArchivo(fileId);
  }
}
