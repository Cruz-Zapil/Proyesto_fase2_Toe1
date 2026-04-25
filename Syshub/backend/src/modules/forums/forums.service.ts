import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hilo } from './hilo.entity';
import { Comentario } from './comentario.entity';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Hilo)
    private hilosRepository: Repository<Hilo>,
    @InjectRepository(Comentario)
    private comentariosRepository: Repository<Comentario>,
  ) {}

  // Lista todos los hilos abiertos, más recientes primero
  findAllHilos() {
    return this.hilosRepository.find({
      where: { estado: 'abierto' },
      order: { created_at: 'DESC' },
    });
  }

  // Detalle de un hilo por UUID
  async findOneHilo(id: string) {
    const hilo = await this.hilosRepository.findOne({ where: { id } });
    if (!hilo) throw new NotFoundException('Hilo no encontrado');
    return hilo;
  }

  // Crea un hilo nuevo
  // autorId debe venir del JWT, no del body (lo haremos cuando implementemos guards)
  async createHilo(data: Partial<Hilo>) {
    const hilo = this.hilosRepository.create(data);
    return this.hilosRepository.save(hilo);
  }

  // Lista comentarios de un hilo, ordenados por fecha
  findComentariosByHilo(hiloId: string) {
    return this.comentariosRepository.find({
      where: { hiloId, estado: 'visible' },
      order: { created_at: 'ASC' },
    });
  }

  // Agrega un comentario a un hilo
  async createComentario(hiloId: string, data: Partial<Comentario>) {
    // Verificar que el hilo existe antes de comentar
    await this.findOneHilo(hiloId);
    const comentario = this.comentariosRepository.create({ ...data, hiloId });
    return this.comentariosRepository.save(comentario);
  }
}