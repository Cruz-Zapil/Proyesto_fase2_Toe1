import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  // Lista proyectos publicados, ordenados por fecha
  findAll() {
    return this.projectsRepository.find({
      where: { estado: 'publicado' },
      order: { created_at: 'DESC' },
    });
  }

  // Busca un proyecto por UUID, lanza 404 si no existe
  async findOne(id: string) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Proyecto no encontrado');
    return project;
  }

  // Crea un proyecto nuevo — el autorId viene del token JWT (no del body)
  async create(data: Partial<Project>) {
    const project = this.projectsRepository.create(data);
    return this.projectsRepository.save(project);
  }

  // Actualiza solo los campos enviados
  async update(id: string, data: Partial<Project>) {
    await this.projectsRepository.update(id, data);
    return this.findOne(id);
  }

  // Eliminado lógico: cambia estado a 'archivado' en vez de borrar
  async remove(id: string) {
    await this.projectsRepository.update(id, { estado: 'archivado' });
    return { message: 'Proyecto archivado correctamente' };
  }
}