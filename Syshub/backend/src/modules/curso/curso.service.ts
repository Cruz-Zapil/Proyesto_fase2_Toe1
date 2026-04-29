import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Curso } from "./curso.entity";

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
  ) {}

  async findById(id: string) {
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: ['carrera'],
    });

    if (!curso) throw new NotFoundException('Curso no encontrado');

    return curso;
  }

  async findByCarrera(carreraId: string) {
    return this.cursoRepository.find({
      where: {
        carrera: { id: carreraId },
      },
    });
  }
}