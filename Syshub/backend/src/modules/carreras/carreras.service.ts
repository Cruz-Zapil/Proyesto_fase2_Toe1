import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrera } from './carrera.entity';
import { Curso } from './curso.entity';

@Injectable()
export class CarrerasService {
  constructor(
    @InjectRepository(Carrera)
    private carrerasRepository: Repository<Carrera>,
    @InjectRepository(Curso)
    private cursosRepository: Repository<Curso>,
  ) {}

  // Retorna todas las carreras activas
  findAll() {
    return this.carrerasRepository.find({ where: { activo: true } });
  }

  // Retorna un carrera por UUID
  findOne(id: string) {
    return this.carrerasRepository.findOne({ where: { id } });
  }

  // Retorna cursos de una carrera específica
  findCursosByCarrera(carreraId: string) {
    return this.cursosRepository.find({ where: { carreraId, activo: true } });
  }
}