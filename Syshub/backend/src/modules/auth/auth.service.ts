import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Carrera } from '../carreras/carrera.entity';
import { UsuarioCarrera } from '../carreras/usuario_carrera.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(Carrera)
    private carrerasRepository: Repository<Carrera>,
    @InjectRepository(UsuarioCarrera)
    private usuarioCarreraRepository: Repository<UsuarioCarrera>,
  ) {}

  async register(data: { nombre: string; email: string; password: string; carreraId: string }) {
    const exists = await this.usersService.findByEmail(data.email);
    if (exists) throw new BadRequestException('El email ya está registrado');

    const carrera = await this.carrerasRepository.findOne({ where: { id: data.carreraId } });
    if (!carrera) throw new BadRequestException('Carrera no válida');

    const password_hash = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      nombre: data.nombre,
      email: data.email,
      password: password_hash,
      estado: 'activo',
      rolId: process.env.DEFAULT_ROLE_ID,
    });

    await this.usuarioCarreraRepository.save({
      usuario_id: user.id,
      carrera_id: data.carreraId,
      fecha_inicio: new Date(),
      es_principal: true,
      estado: 'activo',
    });

    return { id: user.id, nombre: user.nombre, email: user.email };
  }

  async login(email: string, password: string) {
    // 1. Buscar usuario por email
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    // 2. Verificar que el usuario esté activo
    if (user.estado !== 'activo') throw new UnauthorizedException('Usuario suspendido o eliminado');

    // 3. Comparar contraseña con el hash guardado
    const passwordValido = await bcrypt.compare(password, user.password);
    if (!passwordValido) throw new UnauthorizedException('Credenciales incorrectas');

    // 4. Generar JWT con datos del usuario en el payload
    // El payload es la info que viaja dentro del token
    const payload = { sub: user.id, email: user.email, rolId: user.rolId };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rolId: user.rolId }
    };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}