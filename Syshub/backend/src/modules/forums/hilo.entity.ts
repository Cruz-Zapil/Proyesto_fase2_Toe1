import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hilos')
export class Hilo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'autor_id', type: 'uuid' })
  autorId: string;

  @Column({ name: 'curso_id', type: 'uuid', nullable: true })
  cursoId: string;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ default: 'abierto' })
  estado: string;

  @Column({ default: 0 })
  vistas: number;

  @Column({ default: 0 })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}