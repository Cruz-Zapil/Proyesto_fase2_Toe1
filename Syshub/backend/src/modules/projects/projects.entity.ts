import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('proyectos')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'autor_id', type: 'uuid' })
  autorId: string;

  @Column({ name: 'curso_id', type: 'uuid', nullable: true })
  cursoId: string;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ name: 'stack_tecnologico', length: 255, nullable: true })
  stackTecnologico: string;

  @Column({ name: 'area_tecnica', length: 100, nullable: true })
  areaTecnica: string;

  @Column({ default: 'borrador' })
  estado: string;

  @Column({ default: false })
  destacado: boolean;

  @Column({ name: 'destacado_por', type: 'uuid', nullable: true })
  destacadoPor: string;

  @Column({ default: 0 })
  vistas: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}