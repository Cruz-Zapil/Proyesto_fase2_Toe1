import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ModerationService {
  constructor(private readonly dataSource: DataSource) {}

  async hideContent( moderatorId: string, tipoContenido: string, contenidoId: string, motivo: string ) {
    if (tipoContenido !== 'proyecto' && tipoContenido !== 'hilo' && tipoContenido !== 'articulo') {
      throw new BadRequestException('Tipo de contenido inválido');
    }

    let tableName = '';
    if (tipoContenido === 'proyecto') tableName = 'proyectos';
    else if (tipoContenido === 'hilo') tableName = 'hilos';
    else if (tipoContenido === 'articulo') tableName = 'articulos';

    await this.dataSource.query(
      `UPDATE ${tableName} SET oculto = true WHERE id = $1`,
      [contenidoId]
    );

    await this.dataSource.query(
      `INSERT INTO reportes (tipo_contenido, contenido_id, motivo, estado, usuario_moderador_id) 
       VALUES ($1, $2, $3, 'revisado', $4)`,
      [tipoContenido, contenidoId, motivo, moderatorId]
    );

    return { success: true, message: 'Contenido ocultado correctamente' };
  }

  async restoreContent( adminId: string, tipoContenido: string, contenidoId: string ) {
    if (tipoContenido !== 'proyecto' && tipoContenido !== 'hilo' && tipoContenido !== 'articulo') {
      throw new BadRequestException('Tipo de contenido inválido');
    }

    let tableName = '';
    if (tipoContenido === 'proyecto') tableName = 'proyectos';
    else if (tipoContenido === 'hilo') tableName = 'hilos';
    else if (tipoContenido === 'articulo') tableName = 'articulos';

    await this.dataSource.query(
      `UPDATE ${tableName} SET oculto = false WHERE id = $1`,
      [contenidoId]
    );

    return { success: true, message: 'Contenido restaurado (público) correctamente' };
  }

  async getHiddenContent() {
    const reportes = await this.dataSource.query(`
      SELECT 
        r.id as reporte_id,
        r.tipo_contenido,
        r.contenido_id,
        r.motivo,
        r.fecha_reporte,
        u.nombre as moderador_nombre
      FROM reportes r
      LEFT JOIN usuarios u ON r.usuario_moderador_id = u.id
      WHERE r.estado = 'revisado'
      ORDER BY r.fecha_reporte DESC
    `);
    
    for (const rp of reportes) {
      if (rp.tipo_contenido === 'proyecto') {
        const res = await this.dataSource.query(`SELECT nombre FROM proyectos WHERE id = $1`, [rp.contenido_id]);
        rp.titulo_contenido = res[0]?.nombre || 'Proyecto Desconocido';
      } else if (rp.tipo_contenido === 'hilo') {
        const res = await this.dataSource.query(`SELECT titulo FROM hilos WHERE id = $1`, [rp.contenido_id]);
        rp.titulo_contenido = res[0]?.titulo || 'Hilo Desconocido';
      } else if (rp.tipo_contenido === 'articulo') {
        const res = await this.dataSource.query(`SELECT titulo FROM articulos WHERE id = $1`, [rp.contenido_id]);
        rp.titulo_contenido = res[0]?.titulo || 'Articulo Desconocido';
      }
    }

    return reportes;
  }

  async deleteContent(tipoContenido: string, contenidoId: string) {
    if (tipoContenido !== 'proyecto' && tipoContenido !== 'hilo' && tipoContenido !== 'articulo') {
      throw new BadRequestException('Tipo de contenido inválido');
    }

    let tableName = '';
    if (tipoContenido === 'proyecto') tableName = 'proyectos';
    else if (tipoContenido === 'hilo') tableName = 'hilos';
    else if (tipoContenido === 'articulo') tableName = 'articulos';

    await this.dataSource.query(`UPDATE ${tableName} SET estado = 'eliminado' WHERE id = $1`, [contenidoId]);
    await this.dataSource.query(`UPDATE reportes SET estado = 'resuelto' WHERE contenido_id = $1 AND tipo_contenido = $2`, [contenidoId, tipoContenido]);

    return { success: true, message: 'Contenido eliminado correctamente' };
  }
}
