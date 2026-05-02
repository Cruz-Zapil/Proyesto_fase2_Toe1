import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Project } from './projects.entity';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private dataSource: DataSource,
  ) {}

  // Lista solo proyectos publicados y de visibilidad pública
  async findAll() {
    return this.dataSource.query(`
      SELECT
        p.id,
        p.autor_id AS "autorId",
        u.nombre AS "autorNombre",
        u.apellidos AS "autorApellidos",
        p.curso_id AS "cursoId",
        p.titulo,
        p.descripcion,
        p.area_tecnica AS "areaTecnicaId",
        at.nombre AS "areaTecnicaNombre",
        p.estado,
        p.visibilidad,
        p.destacado,
        p.destacado_por AS "destacadoPor",
        p.vistas,
        p.rating,
        p.created_at AS "created_at",
        p.updated_at AS "updated_at"
      FROM proyectos p
      LEFT JOIN usuarios u ON u.id = p.autor_id
      LEFT JOIN area_tecnica at ON at.id = p.area_tecnica
      WHERE p.estado = 'publicado'
        AND p.visibilidad = 'publico'
      ORDER BY p.created_at DESC
    `);
  }

  // Guarda metadata de un archivo asociado a un proyecto
  async saveArchivo(
    proyectoId: string,
    nombreOriginal: string,
    urlStorage: string,
    tipoMime: string,
    tamanoBytes: number,
  ) {
    const res = await this.dataSource.query(
      `
      INSERT INTO archivos_proyecto (proyecto_id, nombre_original, url_storage, tipo_mime, tamano_bytes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [proyectoId, nombreOriginal, urlStorage, tipoMime, tamanoBytes],
    );

    return res[0];
  }

  // Lista archivos de un proyecto
  async listArchivos(proyectoId: string) {
    return this.dataSource.query(`SELECT * FROM archivos_proyecto WHERE proyecto_id = $1 ORDER BY created_at DESC`, [proyectoId]);
  }

  // Elimina metadata y archivo del FS (si existe)
  async removeArchivo(fileId: string) {
    const rows = await this.dataSource.query(`SELECT url_storage FROM archivos_proyecto WHERE id = $1`, [fileId]);
    if (!rows.length) throw new NotFoundException('Archivo no encontrado');
    const url = rows[0].url_storage as string;

    // Intentar borrar archivo en disco si la ruta es relativa
    try {
      const rel = url.replace(/^\//, '');
      const p = join(process.cwd(), rel);
      if (existsSync(p)) {
        unlinkSync(p);
      }
    } catch (err) {
      // Ignorar errores de borrado físico
    }

    await this.dataSource.query(`DELETE FROM archivos_proyecto WHERE id = $1`, [fileId]);
    return { message: 'Archivo eliminado' };
  }

  // Verifica si un usuario es dueño del proyecto
  async isProjectOwner(projectId: string, userId: string) {
    const rows = await this.dataSource.query(`SELECT autor_id FROM proyectos WHERE id = $1`, [projectId]);
    if (!rows.length) return false;
    return rows[0].autor_id === userId;
  }

  // Busca un proyecto por UUID, lanza 404 si no existe
  async findOne(id: string) {
    const project = await this.dataSource.query(
      `
      SELECT
        p.id,
        p.autor_id AS "autorId",
        u.nombre AS "autorNombre",
        u.apellidos AS "autorApellidos",
        p.curso_id AS "cursoId",
        p.titulo,
        p.descripcion,
        p.area_tecnica AS "areaTecnicaId",
        at.nombre AS "areaTecnicaNombre",
        p.estado,
        p.visibilidad,
        p.destacado,
        p.destacado_por AS "destacadoPor",
        p.vistas,
        p.rating,
        p.created_at AS "created_at",
        p.updated_at AS "updated_at"
      FROM proyectos p
      LEFT JOIN usuarios u ON u.id = p.autor_id
      LEFT JOIN area_tecnica at ON at.id = p.area_tecnica
      WHERE p.id = $1
      LIMIT 1
    `,
      [id],
    );

    if (!project.length) throw new NotFoundException('Proyecto no encontrado');
    return project[0];
  }

  // Crea un proyecto nuevo con etiquetas y tecnologías
  async create(data: Partial<Project> & { etiquetaIds?: string[]; tecnologiaIds?: string[] }) {
    const { etiquetaIds, tecnologiaIds, ...projectData } = data;
    
    const project = this.projectsRepository.create(projectData);
    const savedProject = await this.projectsRepository.save(project);

    // Vincular etiquetas si existen
    if (etiquetaIds && etiquetaIds.length > 0) {
      await this.attachEtiquetas(savedProject.id, etiquetaIds);
    }

    // Vincular tecnologías si existen
    if (tecnologiaIds && tecnologiaIds.length > 0) {
      await this.attachTecnologias(savedProject.id, tecnologiaIds);
    }

    return this.findOne(savedProject.id);
  }

  // Actualiza solo los campos enviados
  async update(id: string, data: Partial<Project> & { etiquetaIds?: string[]; tecnologiaIds?: string[] }) {
    const { etiquetaIds, tecnologiaIds, ...projectData } = data;
    
    await this.projectsRepository.update(id, projectData);

    // Actualizar etiquetas si se proporciona
    if (etiquetaIds) {
      // Limpiar etiquetas existentes
      await this.dataSource.query(`DELETE FROM proyecto_etiqueta WHERE proyecto_id = $1`, [id]);
      // Agregar nuevas
      if (etiquetaIds.length > 0) {
        await this.attachEtiquetas(id, etiquetaIds);
      }
    }

    // Actualizar tecnologías si se proporciona
    if (tecnologiaIds) {
      // Limpiar tecnologías existentes
      await this.dataSource.query(`DELETE FROM proyecto_tecnologia WHERE proyecto_id = $1`, [id]);
      // Agregar nuevas
      if (tecnologiaIds.length > 0) {
        await this.attachTecnologias(id, tecnologiaIds);
      }
    }

    return this.findOne(id);
  }

  // Eliminado lógico: cambia estado a 'archivado' en vez de borrar
  async remove(id: string) {
    await this.projectsRepository.update(id, { estado: 'archivado' });
    return { message: 'Proyecto archivado correctamente' };
  }

  async getAreasTecnicas() {
    return this.dataSource.query(`
      SELECT id, nombre, descripcion
      FROM area_tecnica
      ORDER BY nombre ASC
    `);
  }

  // Obtiene todas las etiquetas disponibles
  async getEtiquetas() {
    return this.dataSource.query(`
      SELECT id, nombre, uso_count AS "usoCount"
      FROM etiquetas
      ORDER BY nombre ASC
    `);
  }

  // Obtiene todas las tecnologías disponibles
  async getTecnologias() {
    return this.dataSource.query(`
      SELECT id, nombre, descripcion
      FROM tecnologias
      ORDER BY nombre ASC
    `);
  }

  // Obtiene cursos asociados a un usuario (docente o estudiante)
  async getCursosForUser(userId: string) {
    return this.dataSource.query(
      `
      SELECT DISTINCT c.id, c.nombre
      FROM cursos c
      LEFT JOIN curso_docente cd ON cd.curso_id = c.id AND cd.estado_solicitud = 'aprobado'
      LEFT JOIN curso_estudiante ce ON ce.curso_id = c.id AND ce.estado_solicitud = 'aprobado'
      WHERE cd.docente_id = $1 OR ce.estudiante_id = $1
      ORDER BY c.nombre ASC
    `,
      [userId],
    );
  }

  // Vincula etiquetas a un proyecto
  private async attachEtiquetas(projectId: string, etiquetaIds: string[]) {
    for (const etiquetaId of etiquetaIds) {
      await this.dataSource.query(
        `
        INSERT INTO proyecto_etiqueta (proyecto_id, etiqueta_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `,
        [projectId, etiquetaId],
      );
    }
  }

  // Vincula tecnologías a un proyecto
  private async attachTecnologias(projectId: string, tecnologiaIds: string[]) {
    for (const tecId of tecnologiaIds) {
      await this.dataSource.query(
        `
        INSERT INTO proyecto_tecnologia (proyecto_id, tecnologia_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `,
        [projectId, tecId],
      );
    }
  }
}
