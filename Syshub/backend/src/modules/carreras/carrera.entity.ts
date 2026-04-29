import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Division } from '../division/division.entity';
import { Curso } from  '../curso/curso.entity';

@Entity('carreras')
export class Carrera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150, unique: true })
  nombre: string;

  @Column({ length: 50, unique: true, nullable: true })
  codigo: string;

  @Column({ length: 150, nullable: true })
  facultad: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;


  //  relación con división
  @ManyToOne(() => Division, (division) => division.carreras)
  @JoinColumn({ name: 'division_id' })
  division: Division;

  // relación con cursos
@OneToMany(() => Curso, (curso) => curso.carrera)
cursos: Curso[];

}