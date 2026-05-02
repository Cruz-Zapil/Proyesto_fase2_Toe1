import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
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


  async inscribirUsuario(cursoId: string, userId: string, ofertaId: string) {
    if (!ofertaId) {
      throw new BadRequestException('ofertaId es requerido');
    }

    const oferta = await this.dataSource.query(
      `SELECT id FROM curso_oferta WHERE id = $1 AND curso_id = $2 LIMIT 1`,
      [ofertaId, cursoId],
    );

    if (!oferta.length) {
      throw new BadRequestException('La oferta no pertenece al curso indicado');
    }

    const exists = await this.usuarioCursosRepository.findOne({
      where: {
        curso_id: cursoId,
        estudiante_id: userId,
      },
    });

    if (exists) {
      return { message: 'Ya existe una solicitud para este curso' };
    }

    await this.usuarioCursosRepository.save({
      curso_id: cursoId,
      estudiante_id: userId,
      oferta_id: ofertaId,
      estado_solicitud: 'pendiente',
      estado_inscripcion: 'retirado',
    });

    return { message: 'Solicitud enviada. Pendiente de aprobación del admin.' };
  }

  async postularDocente(ofertaId: string, userId: string, rolDocente: 'docente' | 'auxiliar' = 'docente') {
    const oferta = await this.dataSource.query(
      `SELECT id, curso_id AS "cursoId" FROM curso_oferta WHERE id = $1 LIMIT 1`,
      [ofertaId],
    );

    if (!oferta.length) {
      throw new NotFoundException('Oferta de curso no encontrada');
    }

    const role = await this.dataSource.query(
      `
      SELECT r.nombre
      FROM usuarios u
      JOIN roles r ON r.id = u.rol_id
      WHERE u.id = $1
      LIMIT 1
    `,
      [userId],
    );

    if (!role.length) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const roleName = String(role[0].nombre || '').toLowerCase();
    if (roleName !== 'docente' && roleName !== 'ingeniero') {
      throw new ForbiddenException('Solo usuarios con rol docente o ingeniero pueden postularse');
    }

    const exists = await this.dataSource.query(
      `
      SELECT id
      FROM curso_docente
      WHERE oferta_id = $1 AND docente_id = $2
      LIMIT 1
    `,
      [ofertaId, userId],
    );

    if (exists.length) {
      return { message: 'Ya existe una postulación para esta oferta' };
    }

    await this.dataSource.query(
      `
      INSERT INTO curso_docente (curso_id, docente_id, rol_docente, oferta_id, estado_solicitud)
      VALUES ($1, $2, $3, $4, 'pendiente')
    `,
      [oferta[0].cursoId, userId, rolDocente, ofertaId],
    );

    return { message: 'Postulación enviada. Pendiente de aprobación del admin.' };
  }


  async getOfertaCurso(cursoId: string) {
    return this.dataSource.query(
      `
      SELECT id, curso_id AS "cursoId", carrera_id AS "carreraId", seccion, ciclo_academico AS "cicloAcademico", anio_academico AS "anioAcademico", cupo, created_at AS "createdAt"
      FROM curso_oferta
      WHERE curso_id = $1
      ORDER BY anio_academico DESC, ciclo_academico DESC, seccion ASC, created_at DESC
    `,
      [cursoId],
    );
  }

}