import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  // Lista hilos con autor, curso y conteos reales
  async findAllHilos() {
    return this.dataSource.query(`
      SELECT
        h.id,
        h.autor_id AS "autorId",
        u.nombre AS "autorNombre",
        u.apellidos AS "autorApellidos",
        h.curso_id AS "cursoId",
        c.nombre AS "cursoNombre",
        h.titulo,
        h.contenido,
        h.estado,
        h.vistas,
        h.score,
        h.created_at AS "createdAt",
        h.updated_at AS "updatedAt",
        (
          SELECT COUNT(*)
          FROM comentarios com
          WHERE com.hilo_id = h.id AND com.estado = 'visible'
        ) AS "comentariosCount",
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', e.id, 'nombre', e.nombre) ORDER BY e.nombre)
            FROM hilo_etiquetas he
            JOIN etiquetas e ON e.id = he.etiqueta_id
            WHERE he.hilo_id = h.id
          ),
          '[]'::json
        ) AS etiquetas
      FROM hilos h
      JOIN usuarios u ON u.id = h.autor_id
      LEFT JOIN cursos c ON c.id = h.curso_id
      ORDER BY h.created_at DESC
    `);
  }

  // Detalle de un hilo por UUID
  async findOneHilo(id: string) {
    const hilo = await this.dataSource.query(
      `
      SELECT
        h.id,
        h.autor_id AS "autorId",
        u.nombre AS "autorNombre",
        u.apellidos AS "autorApellidos",
        h.curso_id AS "cursoId",
        c.nombre AS "cursoNombre",
        h.titulo,
        h.contenido,
        h.estado,
        h.vistas,
        h.score,
        h.created_at AS "createdAt",
        h.updated_at AS "updatedAt",
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', e.id, 'nombre', e.nombre) ORDER BY e.nombre)
            FROM hilo_etiquetas he
            JOIN etiquetas e ON e.id = he.etiqueta_id
            WHERE he.hilo_id = h.id
          ),
          '[]'::json
        ) AS etiquetas
      FROM hilos h
      JOIN usuarios u ON u.id = h.autor_id
      LEFT JOIN cursos c ON c.id = h.curso_id
      WHERE h.id = $1
      LIMIT 1
    `,
      [id],
    );

    if (!hilo.length) throw new NotFoundException('Hilo no encontrado');
    return hilo[0];
  }

  // Crea un hilo nuevo
  // autorId debe venir del JWT, no del body (lo haremos cuando implementemos guards)
  async createHilo(data: Partial<Hilo> & { etiquetaIds?: string[] }) {
    const { etiquetaIds = [], ...hiloData } = data;
    const hilo = this.hilosRepository.create(hiloData);
    const saved = await this.hilosRepository.save(hilo);

    if (etiquetaIds.length) {
      for (const etiquetaId of etiquetaIds) {
        await this.dataSource.query(
          `
          INSERT INTO hilo_etiquetas (hilo_id, etiqueta_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `,
          [saved.id, etiquetaId],
        );
      }
    }

    return this.findOneHilo(saved.id);
  }

  // Lista comentarios de un hilo, ordenados por fecha
  async findComentariosByHilo(hiloId: string) {
    return this.dataSource.query(
      `
      SELECT
        com.id,
        com.hilo_id AS "hiloId",
        com.usuario_id AS "usuarioId",
        u.nombre AS "usuarioNombre",
        u.apellidos AS "usuarioApellidos",
        com.contenido,
        com.padre_id AS "padreId",
        com.estado,
        com.voto_neto AS "votoNeto",
        com.created_at AS "createdAt",
        com.updated_at AS "updatedAt"
      FROM comentarios com
      JOIN usuarios u ON u.id = com.usuario_id
      WHERE com.hilo_id = $1 AND com.estado = 'visible'
      ORDER BY com.created_at ASC
    `,
      [hiloId],
    );
  }

  // Agrega un comentario a un hilo
  async createComentario(hiloId: string, data: Partial<Comentario>) {
    // Verificar que el hilo existe antes de comentar
    await this.findOneHilo(hiloId);
    const comentario = this.comentariosRepository.create({ ...data, hiloId });
    return this.comentariosRepository.save(comentario);
  }

  async voteThread(threadId: string, userId: string, vote: number) {
    const hilo = await this.findOneHilo(threadId);
    if (!hilo) throw new NotFoundException('Hilo no encontrado');

    await this.dataSource.query(
      `
      INSERT INTO votos_hilos (usuario_id, hilo_id, voto)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario_id, hilo_id)
      DO UPDATE SET voto = EXCLUDED.voto, created_at = NOW()
    `,
      [userId, threadId, vote],
    );

    const score = await this.dataSource.query(
      `SELECT COALESCE(SUM(voto), 0) AS score FROM votos_hilos WHERE hilo_id = $1`,
      [threadId],
    );

    await this.dataSource.query(`UPDATE hilos SET score = $1 WHERE id = $2`, [Number(score[0].score), threadId]);

    return { message: 'Voto registrado', score: Number(score[0].score) };
  }

  async voteComment(commentId: string, userId: string, vote: number) {
    const comment = await this.dataSource.query(`SELECT id FROM comentarios WHERE id = $1`, [commentId]);
    if (!comment.length) throw new NotFoundException('Comentario no encontrado');

    await this.dataSource.query(
      `
      INSERT INTO votos_comentarios (usuario_id, comentario_id, voto)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario_id, comentario_id)
      DO UPDATE SET voto = EXCLUDED.voto, created_at = NOW()
    `,
      [userId, commentId, vote],
    );

    const score = await this.dataSource.query(
      `SELECT COALESCE(SUM(voto), 0) AS score FROM votos_comentarios WHERE comentario_id = $1`,
      [commentId],
    );

    await this.dataSource.query(`UPDATE comentarios SET voto_neto = $1 WHERE id = $2`, [Number(score[0].score), commentId]);

    return { message: 'Voto registrado', score: Number(score[0].score) };
  }

  async getEtiquetas() {
    return this.dataSource.query(`
      SELECT id, nombre, uso_count AS "usoCount"
      FROM etiquetas
      ORDER BY nombre ASC
    `);
  }

  async getCursosInscritos(userId: string) {
    return this.dataSource.query(
      `
      SELECT c.id, c.nombre
      FROM curso_estudiante ce
      JOIN cursos c ON c.id = ce.curso_id
      WHERE ce.estudiante_id = $1
        AND ce.estado_solicitud = 'aprobado'
        AND ce.estado_inscripcion = 'inscrito'
      ORDER BY c.nombre ASC
    `,
      [userId],
    );
  }
}