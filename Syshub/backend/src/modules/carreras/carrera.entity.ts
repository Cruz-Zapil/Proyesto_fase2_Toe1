import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('carreras')
export class Carrera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 150 })
  nombre: string;

  @Column({ unique: true, length: 50, nullable: true })
  codigo: string;

  @Column({ length: 150, nullable: true })
  facultad: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}