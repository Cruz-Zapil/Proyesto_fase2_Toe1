import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario_carrera')
export class UsuarioCarrera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuario_id: string;

  @Column({ name: 'carrera_id', type: 'uuid' })
  carrera_id: string;

  @Column({ default: 'activo' })
  estado: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fecha_inicio: Date;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fecha_fin: Date;

  @Column({ name: 'es_principal', default: false })
  es_principal: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}