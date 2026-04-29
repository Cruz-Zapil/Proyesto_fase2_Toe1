import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";


export enum EstadoUsuario {
  ACTIVO = 'activo',
  PENDIENTE = 'pendiente',
  SUSPENDIDO = 'suspendido',
  ELIMINADO = 'eliminado',
}


export enum EstadoCarreraUsuario {
  ACTIVO = 'activo',
  SUSPENDIDO = 'suspendido',
  ABANDONADO = 'abandonado',
  FINALIZADO = 'finalizado',
}


@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ name: 'apellidos', length: 255 })
  apellidos: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ nullable: true, length: 20 })
  telefono_casa: string;

  @Column({ name: 'registro_academico', length: 50, unique: true })
  registro_academico: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  password: string;

  @Column({ name: 'rol_id', type: 'uuid' })
  rolId: string;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.PENDIENTE,
  })
  estado: EstadoUsuario;

  @Column({ nullable: true, length: 255 })
  token_verificacion: string;

  @Column({ nullable: true, type: 'timestamp' })
  email_verificado_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
