import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario_curso')
export class UsuarioCurso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuario_id: string;

  @Column({ name: 'curso_id', type: 'uuid' })
  curso_id: string;

  @Column({ default: 'activo' })
  estado: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}