import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EstadoUsuario, User } from '../users/user.entity';
import { Division } from '../division/division.entity';
import { Carrera } from '../carreras/carrera.entity';
import { Curso } from '../curso/curso.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

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
    private dataSource: DataSource,
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
    return this.dataSource.query(`
      SELECT
        u.id,
        u.nombre,
        u.apellidos,
        u.email,
        u.telefono,
        u.telefono_casa AS "telefonoCasa",
        u.registro_academico AS "registroAcademico",
        u.estado,
        u.created_at AS "createdAt",
        u.updated_at AS "updatedAt",
        r.nombre AS "rolNombre",
        r.id AS "rolId"
      FROM usuarios u
      JOIN roles r ON r.id = u.rol_id
      ORDER BY u.created_at DESC
    `);
  }

  async updateUserState(
    userId: string,
    estado: EstadoUsuario,
    adminUserId: string,
    adminPassword?: string,
  ) {
    const target = await this.dataSource.query(
      `
      SELECT u.id, u.estado, u.password_hash AS "passwordHash", r.nombre AS "rolNombre"
      FROM usuarios u
      JOIN roles r ON r.id = u.rol_id
      WHERE u.id = $1
      LIMIT 1
    `,
      [userId],
    );

    if (!target.length) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const targetUser = target[0];
    const rolNombre = String(targetUser.rolNombre || '').toLowerCase();

    if (!Object.values(EstadoUsuario).includes(estado)) {
      throw new BadRequestException('Estado de usuario no válido');
    }

    if (rolNombre === 'estudiante') {
      if (!adminPassword) {
        throw new BadRequestException('La contraseña del admin es requerida para cambiar el estado de un estudiante');
      }

      const adminUser = await this.usersRepository.findOne({ where: { id: adminUserId } });
      if (!adminUser) {
        throw new UnauthorizedException('Admin no válido');
      }

      const passwordOk = await bcrypt.compare(adminPassword, adminUser.password);
      if (!passwordOk) {
        throw new UnauthorizedException('Contraseña de admin incorrecta');
      }
    }

    const result = await this.usersRepository.update(userId, { estado });
    if (!result.affected) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { message: 'Estado de usuario actualizado' };
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

  async createCursoOferta(body: {
    cursoId: string;
    seccion?: string;
    cicloAcademico?: string;
    anioAcademico?: number;
    cupo?: number;
  }) {
    const curso = await this.cursosRepository.findOne({ where: { id: body.cursoId } });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    if (!curso.carreraId) {
      throw new ConflictException('El curso seleccionado no tiene una carrera asociada');
    }

    const seccion = String(body.seccion || '').trim().toUpperCase();
    if (!seccion) {
      throw new ConflictException('La sección es obligatoria');
    }

    const cicloAcademico = String(body.cicloAcademico || '').trim().toLowerCase();
    if (cicloAcademico !== 'primero' && cicloAcademico !== 'segundo') {
      throw new ConflictException('El ciclo académico debe ser primero o segundo');
    }

    const currentYear = new Date().getFullYear();
    const anioAcademico = body.anioAcademico ?? currentYear;
    if (!Number.isInteger(anioAcademico) || anioAcademico < currentYear) {
      throw new ConflictException('El año académico no puede ser anterior al actual');
    }

    const duplicate = await this.dataSource.query(
      `
      SELECT id
      FROM curso_oferta
      WHERE curso_id = $1
        AND carrera_id = $2
        AND seccion = $3
        AND ciclo_academico = $4
        AND anio_academico = $5
      LIMIT 1
    `,
      [curso.id, curso.carreraId, seccion, cicloAcademico, anioAcademico],
    );

    if (duplicate.length) {
      throw new ConflictException('Ya existe una oferta con esa combinación');
    }

    const created = await this.dataSource.query(
      `
      INSERT INTO curso_oferta (curso_id, carrera_id, seccion, ciclo_academico, anio_academico, cupo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, curso_id AS "cursoId", carrera_id AS "carreraId", seccion, ciclo_academico AS "cicloAcademico", anio_academico AS "anioAcademico", cupo, created_at AS "createdAt"
    `,
      [curso.id, curso.carreraId, seccion, cicloAcademico, anioAcademico, body.cupo ?? null],
    );

    return created[0];
  }

  listCursoOfertas() {
    return this.dataSource.query(`
      SELECT
        co.id,
        co.curso_id AS "cursoId",
        c.nombre AS "cursoNombre",
        co.carrera_id AS "carreraId",
        ca.nombre AS "carreraNombre",
        co.seccion,
        co.ciclo_academico AS "cicloAcademico",
        co.anio_academico AS "anioAcademico",
        co.cupo,
        co.created_at AS "createdAt"
      FROM curso_oferta co
      JOIN cursos c ON c.id = co.curso_id
      JOIN carreras ca ON ca.id = co.carrera_id
      ORDER BY co.anio_academico DESC, co.ciclo_academico DESC, co.seccion ASC, co.created_at DESC
    `);
  }

  listPostulacionesDocentesPendientes() {
    return this.dataSource.query(`
      SELECT
        cd.id,
        cd.oferta_id AS "ofertaId",
        cd.curso_id AS "cursoId",
        c.nombre AS "cursoNombre",
        cd.docente_id AS "docenteId",
        u.nombre AS "docenteNombre",
        u.apellidos AS "docenteApellidos",
        cd.rol_docente AS "rolDocente",
        cd.estado_solicitud AS "estadoSolicitud",
        cd.created_at AS "createdAt"
      FROM curso_docente cd
      JOIN usuarios u ON u.id = cd.docente_id
      JOIN cursos c ON c.id = cd.curso_id
      WHERE cd.estado_solicitud = 'pendiente'
      ORDER BY cd.created_at ASC
    `);
  }

  async aprobarPostulacionDocente(id: string) {
    const result = await this.dataSource.query(
      `
      UPDATE curso_docente
      SET estado_solicitud = 'aprobado'
      WHERE id = $1
      RETURNING id
    `,
      [id],
    );

    if (!result.length) throw new NotFoundException('Postulación docente no encontrada');
    return { message: 'Postulación docente aprobada' };
  }

  async rechazarPostulacionDocente(id: string) {
    const result = await this.dataSource.query(
      `
      UPDATE curso_docente
      SET estado_solicitud = 'rechazado'
      WHERE id = $1
      RETURNING id
    `,
      [id],
    );

    if (!result.length) throw new NotFoundException('Postulación docente no encontrada');
    return { message: 'Postulación docente rechazada' };
  }

  listSolicitudesEstudiantesPendientes() {
    return this.dataSource.query(`
      SELECT
        ce.id,
        ce.oferta_id AS "ofertaId",
        ce.curso_id AS "cursoId",
        c.nombre AS "cursoNombre",
        ce.estudiante_id AS "estudianteId",
        u.nombre AS "estudianteNombre",
        u.apellidos AS "estudianteApellidos",
        ce.estado_solicitud AS "estadoSolicitud",
        ce.estado_inscripcion AS "estadoInscripcion",
        ce.created_at AS "createdAt"
      FROM curso_estudiante ce
      JOIN usuarios u ON u.id = ce.estudiante_id
      JOIN cursos c ON c.id = ce.curso_id
      WHERE ce.estado_solicitud = 'pendiente'
      ORDER BY ce.created_at ASC
    `);
  }

  async aprobarSolicitudEstudiante(id: string) {
    const result = await this.dataSource.query(
      `
      UPDATE curso_estudiante
      SET estado_solicitud = 'aprobado', estado_inscripcion = 'inscrito'
      WHERE id = $1
      RETURNING id
    `,
      [id],
    );

    if (!result.length) throw new NotFoundException('Solicitud de inscripción no encontrada');
    return { message: 'Solicitud de estudiante aprobada' };
  }

  async rechazarSolicitudEstudiante(id: string) {
    const result = await this.dataSource.query(
      `
      UPDATE curso_estudiante
      SET estado_solicitud = 'rechazado', estado_inscripcion = 'retirado'
      WHERE id = $1
      RETURNING id
    `,
      [id],
    );

    if (!result.length) throw new NotFoundException('Solicitud de inscripción no encontrada');
    return { message: 'Solicitud de estudiante rechazada' };
  }
}