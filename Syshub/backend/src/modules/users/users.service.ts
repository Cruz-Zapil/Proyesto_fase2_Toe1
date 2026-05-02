import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("Usuario no encontrado");
    const { password, ...rest } = user;
    return rest as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  /// devolver perfil:

  /// perfil privado ()
  async findPrivateById(id: string) {
    const user = await this.userRepository.query(
      `
      SELECT
        u.id,
        u.nombre,
        u.apellidos,
        u.telefono,
        u.telefono_casa,
        u.registro_academico,
        u.email,
        u.rol_id AS "rolId",
        u.estado,
        u.token_verificacion,
        u.email_verificado_at,
        u.created_at,
        u.updated_at,
        r.nombre AS "rolNombre"
      FROM usuarios u
      JOIN roles r ON r.id = u.rol_id
      WHERE u.id = $1
      LIMIT 1
    `,
      [id],
    );

    if (!user.length) throw new NotFoundException("Usuario no encontrado");

    const { password, ...rest } = user[0];
    const normalizedRole = String(rest.rolNombre || "").trim().toLowerCase();
    return {
      ...rest,
      rolNombre: rest.rolNombre || null,
      esAdmin:
        normalizedRole === "admin" ||
        normalizedRole === "administrador" ||
        normalizedRole.includes("admin"),
    };
  }

  /// perfil publico

  async findPublicById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException("Usuario no encontrado");

    return {
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
    };
  }

  /// actualizar perfil:

  async update(id: string, data: Partial<User>) {
    const allowedFields = ["nombre", "apellidos", "telefono", "password"];

    const filteredData: Partial<User> = {};

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        filteredData[key] = data[key];
      }
    }

    if (filteredData.password) {
      filteredData.password = await bcrypt.hash(filteredData.password, 10);
    }

    await this.userRepository.update(id, filteredData);

    return this.findById(id);
  }
}
