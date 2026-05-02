import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Articulo } from './articulo.entity';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(publicadoOnly = false) {
    const query = this.dataSource.createQueryBuilder()
      .select('a.id', 'id')
      .addSelect('a.titulo', 'titulo')
      .addSelect('a.slug', 'slug')
      .addSelect('a.resumen', 'resumen')
      .addSelect('a.contenido_html', 'contenido_html')
      .addSelect('a.imagen_portada', 'imagen_portada')
      .addSelect('a.publicado', 'publicado')
      .addSelect('a.vistas', 'vistas')
      .addSelect('a.created_at', 'created_at')
      .addSelect('a.updated_at', 'updated_at')
      .addSelect('u.id', 'autor_id')
      .addSelect(`CONCAT(u.nombre, ' ', u.apellidos)`, 'autor_nombre')
      .addSelect('COALESCE(json_agg(DISTINCT jsonb_build_object(\'id\', e.id, \'nombre\', e.nombre)) FILTER (WHERE e.id IS NOT NULL), \'[]\'::json)', 'etiquetas')
      .from('articulos', 'a')
      .leftJoin('usuarios', 'u', 'a.autor_id = u.id')
      .leftJoin('articulo_etiqueta', 'ae', 'ae.articulo_id = a.id')
      .leftJoin('etiquetas', 'e', 'e.id = ae.etiqueta_id')
      .groupBy('a.id, u.id');

    if (publicadoOnly) {
      query.where('a.publicado = true');
    }

    query.orderBy('a.created_at', 'DESC');
    const result = await query.getRawMany();
    return result.map((r: any) => ({
      ...r,
      etiquetas: typeof r.etiquetas === 'string' ? JSON.parse(r.etiquetas) : r.etiquetas,
    }));
  }

  async findOne(id: string) {
    const query = this.dataSource.createQueryBuilder()
      .select('a.id', 'id')
      .addSelect('a.titulo', 'titulo')
      .addSelect('a.slug', 'slug')
      .addSelect('a.resumen', 'resumen')
      .addSelect('a.contenido_html', 'contenido_html')
      .addSelect('a.imagen_portada', 'imagen_portada')
      .addSelect('a.publicado', 'publicado')
      .addSelect('a.vistas', 'vistas')
      .addSelect('a.created_at', 'created_at')
      .addSelect('a.updated_at', 'updated_at')
      .addSelect('u.id', 'autor_id')
      .addSelect(`CONCAT(u.nombre, ' ', u.apellidos)`, 'autor_nombre')
      .addSelect('COALESCE(json_agg(DISTINCT jsonb_build_object(\'id\', e.id, \'nombre\', e.nombre)) FILTER (WHERE e.id IS NOT NULL), \'[]\'::json)', 'etiquetas')
      .from('articulos', 'a')
      .leftJoin('usuarios', 'u', 'a.autor_id = u.id')
      .leftJoin('articulo_etiqueta', 'ae', 'ae.articulo_id = a.id')
      .leftJoin('etiquetas', 'e', 'e.id = ae.etiqueta_id')
      .where('a.id = :id', { id })
      .groupBy('a.id, u.id');

    const result = await query.getRawOne();
    if (result) {
      result.etiquetas = typeof result.etiquetas === 'string' ? JSON.parse(result.etiquetas) : result.etiquetas;
    }
    return result;
  }

  async create(autorId: string, dto: any) {
    const { titulo, slug, contenido_html, resumen, imagen_portada, etiquetaIds } = dto;

    const articulo = await this.articuloRepository.save({
      autor_id: autorId,
      titulo,
      slug,
      contenido_html,
      resumen,
      imagen_portada,
      publicado: false,
    });

    if (etiquetaIds && etiquetaIds.length > 0) {
      const values = etiquetaIds.map((etiquetaId: string) =>
        `('${articulo.id}', '${etiquetaId}')`
      ).join(',');

      await this.dataSource.query(
        `INSERT INTO articulo_etiqueta (articulo_id, etiqueta_id) VALUES ${values} ON CONFLICT DO NOTHING`
      );
    }

    return this.findOne(articulo.id);
  }

  async update(id: string, dto: any) {
    const { titulo, slug, contenido_html, resumen, imagen_portada, publicado, etiquetaIds } = dto;

    await this.articuloRepository.update(id, {
      titulo,
      slug,
      contenido_html,
      resumen,
      imagen_portada,
      publicado,
    });

    if (etiquetaIds && etiquetaIds.length > 0) {
      // Remove existing tags
      await this.dataSource.query('DELETE FROM articulo_etiqueta WHERE articulo_id = $1', [id]);

      // Add new tags
      const values = etiquetaIds.map((etiquetaId: string) =>
        `('${id}', '${etiquetaId}')`
      ).join(',');

      await this.dataSource.query(
        `INSERT INTO articulo_etiqueta (articulo_id, etiqueta_id) VALUES ${values} ON CONFLICT DO NOTHING`
      );
    }

    return this.findOne(id);
  }

  async delete(id: string) {
    return this.articuloRepository.delete(id);
  }

  async incrementViews(id: string) {
    return this.articuloRepository.increment({ id }, 'vistas', 1);
  }

  async publish(id: string) {
    return this.articuloRepository.update(id, { publicado: true });
  }

  async getEtiquetas() {
    return this.dataSource.query(`
      SELECT DISTINCT e.id, e.nombre
      FROM etiquetas e
      ORDER BY e.nombre ASC
    `);
  }

  async searchBySlug(slug: string) {
    return this.dataSource.query(`
      SELECT a.id, a.titulo, a.slug, a.resumen, a.contenido_html, a.imagen_portada, a.publicado, a.vistas, a.created_at, a.updated_at,
             u.id as autor_id, CONCAT(u.nombre, ' ', u.apellidos) as autor_nombre
      FROM articulos a
      LEFT JOIN usuarios u ON a.autor_id = u.id
      WHERE a.slug = $1
    `, [slug]);
  }
}
