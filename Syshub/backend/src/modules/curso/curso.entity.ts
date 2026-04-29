import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Carrera } from '../carreras/carrera.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ unique: true, length: 50 })
  codigo: string;

  @Column({ name: 'carrera_id', type: 'uuid', nullable: true })
  carreraId: string;

  @ManyToOne(() => Carrera, (carrera) => carrera.cursos)
  @JoinColumn({ name: 'carrera_id' })
  carrera: Carrera;

  @Column({ name: 'area_tecnica', length: 100 })
  areaTecnica: string;

  @Column({ type: 'int' })
  semestre: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true, type: 'text' })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}