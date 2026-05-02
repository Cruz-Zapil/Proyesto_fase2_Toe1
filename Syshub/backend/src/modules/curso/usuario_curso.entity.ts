import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('curso_estudiante')
export class UsuarioCurso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'curso_id', type: 'uuid' })
  curso_id: string;

  @Column({ name: 'estudiante_id', type: 'uuid' })
  estudiante_id: string;

  @Column({ name: 'oferta_id', type: 'uuid', nullable: true })
  oferta_id: string | null;

  @Column({ name: 'estado_inscripcion', default: 'inscrito' })
  estado_inscripcion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  nota: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}