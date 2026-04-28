import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";
import { use } from "passport";

// La estrategia le dice a Passport cómo extraer y validar el JWT
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // Extrae el token del header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "secret",
    });

    console.log("JWT SECRET EN STRATEGY:", process.env.JWT_SECRET); // ← agrega esto
  }

  // Este método se ejecuta automáticamente después de validar la firma del token
  // El payload es lo que pusimos al hacer jwtService.sign({ sub, email, rolId })
  async validate(payload: { sub: string; email: string; rolId: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException("Token inválido");


    return user; // Passport guarda el resultado en req.user para usarlo en los endpoints protegidos
  }
}
