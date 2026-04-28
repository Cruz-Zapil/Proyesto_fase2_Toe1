import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  password: string;

  @Column({ name: 'rol_id', type: 'uuid' })
  rolId: string;

@Column({ 
  default: 'pendiente',  // ← cambiado de 'activo' a 'pendiente'
  // TypeORM no maneja CHECK constraints nativamente,
  // por eso lo definimos directo en la BD
})
estado: string;

  @Column({ nullable: true, length: 255 })
  token_verificacion: string;

  @Column({ nullable: true, type: 'timestamp' })
  email_verificado_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
