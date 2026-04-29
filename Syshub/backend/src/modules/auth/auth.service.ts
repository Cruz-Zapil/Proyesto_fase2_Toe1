import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { Carrera } from "../carreras/carrera.entity";
import { UsuarioCarrera } from "../carreras/usuario_carrera.entity";
import { DataSource } from "typeorm";
import { EstadoCarreraUsuario, EstadoUsuario, User } from "../users/user.entity";
import * as bcrypt from "bcryptjs";
import { RegisterDto } from "./dto/register.dto";
import * as crypto from 'crypto';



@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(Carrera)
    private carrerasRepository: Repository<Carrera>,
    @InjectRepository(UsuarioCarrera)
    private usuarioCarreraRepository: Repository<UsuarioCarrera>,
    private dataSource: DataSource,
  ) {}


  async register(data: RegisterDto) {
  const exists = await this.usersService.findByEmail(data.email);
  if (exists) throw new BadRequestException("El email ya está registrado");

  const carrera = await this.carrerasRepository.findOne({
    where: { id: data.carreraId },
  });
  if (!carrera) throw new BadRequestException("Carrera no válida");

  if (!process.env.DEFAULT_ROLE_ID) {
    throw new Error("DEFAULT_ROLE_ID no definido");
  }

  const password_hash = await bcrypt.hash(data.password, 10);

  return await this.dataSource.transaction(async (manager) => {
    const user = await manager.save(User, {
      nombre: data.nombre,
      apellidos: data.apellidos,
      telefono: data.telefono,
      registro_academico: data.registro_academico,
      email: data.email,
      password: password_hash,
      estado: EstadoUsuario.PENDIENTE,
      rolId: process.env.DEFAULT_ROLE_ID,
    });

    await manager.save(UsuarioCarrera, {
      usuario_id: user.id,
      carrera_id: data.carreraId,
      fecha_inicio: new Date(),
      es_principal: true,
      estado: EstadoCarreraUsuario.ACTIVO
    });

    return {
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
    };
  });
}
  


  async login(email: string, password: string) {
    console.log("JWT SECRET EN LOGIN:", process.env.JWT_SECRET); // ← agrega esto

    console.log("EMAIL RECIBIDO:", email); // ← agrega esto
    console.log("PASSWORD RECIBIDO:", password); // ← y esto

    // 1. Buscar usuario por email
    const user = await this.usersService.findByEmail(email);

    console.log("USUARIO ENCONTRADO:", user); // ← y esto

    if (!user) throw new UnauthorizedException("Credenciales incorrectas");

    if (user.estado === EstadoUsuario.PENDIENTE)
      throw new UnauthorizedException(
        "Tu cuenta está pendiente de aprobación por un moderador",
      );

    // 2. Verificar que el usuario esté activo
    if (user.estado !== EstadoUsuario.ACTIVO)
      throw new UnauthorizedException("Usuario suspendido o eliminado");

    // 3. Comparar contraseña con el hash guardado
    const passwordValido = await bcrypt.compare(password, user.password);
    if (!passwordValido)
      throw new UnauthorizedException("Credenciales incorrectas");

    // 4. Generar JWT con datos del usuario en el payload
    // El payload es la info que viaja dentro del token
    const payload = { sub: user.id, email: user.email, rolId: user.rolId };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rolId: user.rolId,
      },
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
