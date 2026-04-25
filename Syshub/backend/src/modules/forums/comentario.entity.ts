import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hilo_id', type: 'uuid' })
  hiloId: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ name: 'padre_id', type: 'uuid', nullable: true })
  padreId: string;

  @Column({ default: 'visible' })
  estado: string;

  @Column({ name: 'voto_neto', default: 0 })
  votoNeto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}