import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Repository } from "typeorm";
import { Curso } from "./curso.entity";
import { UsuarioCurso } from '../curso/usuario_curso.entity';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
    @InjectRepository(UsuarioCurso)
    private usuarioCursosRepository: Repository<UsuarioCurso>,
    private dataSource: DataSource,
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


  async inscribirUsuario(cursoId: string, userId: string, ofertaId?: string) {
    const exists = await this.usuarioCursosRepository.findOne({
      where: {
        curso_id: cursoId,
        estudiante_id: userId,
        oferta_id: ofertaId ?? IsNull(),
      },
    });

    if (exists) {
      return { message: 'Ya inscrito' };
    }

    await this.usuarioCursosRepository.save({
      curso_id: cursoId,
      estudiante_id: userId,
      oferta_id: ofertaId ?? null,
      estado_inscripcion: 'inscrito',
    });

    return { message: 'Inscripción exitosa' };
  }


  async getOfertaCurso(cursoId: string) {
    return this.dataSource.query(
      `
      SELECT id, curso_id AS "cursoId", carrera_id AS "carreraId", seccion, ciclo_academico AS "cicloAcademico", cupo, created_at AS "createdAt"
      FROM curso_oferta
      WHERE curso_id = $1
      ORDER BY ciclo_academico DESC NULLS LAST, seccion ASC NULLS LAST, created_at DESC
    `,
      [cursoId],
    );
  }

}