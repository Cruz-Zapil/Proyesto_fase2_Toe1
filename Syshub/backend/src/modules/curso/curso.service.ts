import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Curso } from "./curso.entity";
import { UsuarioCurso } from '../curso/usuario_curso.entity';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
        @InjectRepository(UsuarioCurso)
    private usuarioCursosRepository: Repository<UsuarioCurso>
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


    async findCursosByCarrera(carreraId: string) {
  return this.cursoRepository.find({
    where: {
      carrera: { id: carreraId },
    },
  });
}

  async findEstudiantesByCurso(cursoId: string) {
  return this.usuarioCursosRepository.find({
    where: { curso_id: cursoId },
  });
}


async inscribirUsuario(cursoId: string, userId: string) {
  const exists = await this.usuarioCursosRepository.findOne({
    where: { curso_id: cursoId, usuario_id: userId },
  });

  if (exists) {
    return { message: 'Ya inscrito' };
  }

  await this.usuarioCursosRepository.save({
    curso_id: cursoId,
    usuario_id: userId,
  });

  return { message: 'Inscripción exitosa' };
}


async getOfertaCurso(cursoId: string) {
  return {
    cursoId,
    secciones: [
      { nombre: 'A', cupo: 30 },
      { nombre: 'B', cupo: 25 },
    ],
  };
}

}