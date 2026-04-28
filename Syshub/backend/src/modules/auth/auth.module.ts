// AuthModule necesita acceso a UsuarioCarrera y Carrera para el registro,
// por eso importa CarrerasModule completo en vez de repetir las entidades
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { CarrerasModule } from "../carreras/carreras.module";
import { Carrera } from "../carreras/carrera.entity";
import { UsuarioCarrera } from "../carreras/usuario_carrera.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrera, UsuarioCarrera]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || "secret",
        signOptions: { expiresIn: process.env.JWT_EXPIRATION || "7d" },
      }),
    }),
    UsersModule, // nos da acceso a UsersService
    CarrerasModule, // nos da acceso a CarrerasService y repositorios de carreras
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
