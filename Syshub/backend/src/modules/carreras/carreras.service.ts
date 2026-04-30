import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrera } from './carrera.entity';
import { Curso } from '../curso/curso.entity';

@Injectable()
export class CarrerasService {
  constructor(
    @InjectRepository(Carrera)
    private carrerasRepository: Repository<Carrera>,
    @InjectRepository(Curso)
    private cursosRepository: Repository<Curso>,
  ) {}

  // Retorna todas las carreras activas
  async findAllTrue() {
    return this.carrerasRepository.find({ where: { activo: true } });
  }


  // GET /carreras
  async findAll() {
    return this.carrerasRepository.find({
      relations: ['division'],
    });
  }

  // GET /carreras/:id
  async findById(id: string) {
    const carrera = await this.carrerasRepository.findOne({
      where: { id },
      relations: ['division'],
    });

    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }

    return carrera;
  }

  //  GET /divisiones/:id/carreras
  async findByDivision(divisionId: string) {
    return this.carrerasRepository.find({
      where: {
        division: { id: divisionId },
      },
      relations: ['division'],
    });
  }



}