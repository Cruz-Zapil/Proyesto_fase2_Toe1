import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoUsuario, User } from '../users/user.entity';
import { Division } from '../division/division.entity';
import { Carrera } from '../carreras/carrera.entity';
import { Curso } from '../curso/curso.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Division)
    private divisionsRepository: Repository<Division>,
    @InjectRepository(Carrera)
    private carrerasRepository: Repository<Carrera>,
    @InjectRepository(Curso)
    private cursosRepository: Repository<Curso>,
  ) {}

  // Lista usuarios pendientes de aprobación
  findPendientes() {
    return this.usersRepository.find({
      where: { estado: EstadoUsuario.PENDIENTE },
      order: { created_at: 'ASC' },
    });
  }

  // Moderador aprueba al estudiante
  async aprobar(id: string) {
    const result = await this.usersRepository.update(id, { estado: EstadoUsuario.ACTIVO });

    if (!result.affected) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { message: 'Usuario aprobado' };
  }

  // Moderador rechaza y elimina al estudiante
  async rechazar(id: string) {
    const result = await this.usersRepository.update(id, { estado: EstadoUsuario.ELIMINADO });

    if (!result.affected) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { message: 'Usuario rechazado' };
  }

  // Lista todos los usuarios
  findAll() {
    return this.usersRepository.find({ order: { created_at: 'DESC' } });
  }

  findDivisions() {
    return this.divisionsRepository.find({ order: { created_at: 'DESC' } });
  }

  findCarreras() {
    return this.carrerasRepository.find({
      relations: ['division'],
      order: { created_at: 'DESC' },
    });
  }

  findCursos() {
    return this.cursosRepository.find({
      relations: ['carrera'],
      order: { created_at: 'DESC' },
    });
  }

  async createDivision(body: { codigo: string; nombre: string; descripcion?: string }) {
    const division = this.divisionsRepository.create(body);
    return this.divisionsRepository.save(division);
  }

  async createCarrera(body: { nombre: string; codigo?: string; facultad?: string; divisionId: string }) {
    const division = await this.divisionsRepository.findOne({ where: { id: body.divisionId } });

    if (!division) {
      throw new NotFoundException('División no encontrada');
    }

    const carrera = this.carrerasRepository.create({
      nombre: body.nombre,
      codigo: body.codigo,
      facultad: body.facultad,
      activo: true,
      division,
    });

    return this.carrerasRepository.save(carrera);
  }

  async createCurso(body: {
    nombre: string;
    codigo: string;
    semestre: number;
    descripcion?: string;
    carreraId: string;
    activo?: boolean;
  }) {
    const carrera = await this.carrerasRepository.findOne({ where: { id: body.carreraId } });

    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }

    const curso = this.cursosRepository.create({
      nombre: body.nombre,
      codigo: body.codigo,
      semestre: body.semestre,
      descripcion: body.descripcion,
      activo: body.activo ?? true,
      carreraId: carrera.id,
    });

    return this.cursosRepository.save(curso);
  }
}