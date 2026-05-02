import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Etiqueta } from '../projects/etiqueta.entity';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  autor_id: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  slug: string;

  @Column({ type: 'text' })
  contenido_html: string;

  @Column({ type: 'text', nullable: true })
  resumen: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagen_portada: string;

  @Column({ type: 'boolean', default: false })
  publicado: boolean;

  @Column({ type: 'integer', default: 0 })
  vistas: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { eager: false })
  autor?: User;

  @ManyToMany(() => Etiqueta, { eager: false })
  @JoinTable({
    name: 'articulo_etiqueta',
    joinColumn: { name: 'articulo_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'etiqueta_id', referencedColumnName: 'id' },
  })
  etiquetas?: Etiqueta[];
}
