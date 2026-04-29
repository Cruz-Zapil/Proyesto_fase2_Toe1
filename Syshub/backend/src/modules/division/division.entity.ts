
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Carrera } from '../carreras/carrera.entity';

@Entity('division')
export class Division {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // relación con carreras
  @OneToMany(() => Carrera, (carrera) => carrera.division)
  carreras: Carrera[];
}