import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoUsuario, User } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Lista usuarios pendientes de aprobación
  findPendientes() {
    return this.usersRepository.find({
      where: { estado: EstadoUsuario.PENDIENTE },
      order: { created_at: 'ASC' },
    });
  }

  // Moderador aprueba al estudiante
  aprobar(id: string) {
    return this.usersRepository.update(id, { estado: EstadoUsuario.ACTIVO });
  }

  // Moderador rechaza y elimina al estudiante
  rechazar(id: string) {
    return this.usersRepository.update(id, { estado: EstadoUsuario.ELIMINADO });
  }

  // Lista todos los usuarios
  findAll() {
    return this.usersRepository.find({ order: { created_at: 'DESC' } });
  }
}