import { Controller, Get, Put, Body, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UseGuards, Request, ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateUserDto } from "./update-user.dto";
import { ParseUUIDPipe } from '@nestjs/common';
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // obtener su propio perfil

  // privado
@UseGuards(JwtAuthGuard)
@Get('me')
getMe(@Request() req: any) {
  console.log("getMe req.user =>", req.user);
  return this.usersService.findPrivateById(req.user.id || req.user.sub);
}

@UseGuards(JwtAuthGuard)
@Get('me/content')
getMyContent(@Request() req: any) {
  return this.usersService.findMyContent(req.user.id || req.user.sub);
}

// público
@Get(':id')
findPublic(@Param("id", new ParseUUIDPipe()) id: string) {
  return this.usersService.findPublicById(id);
}


  /// editcion de usuario

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
    @Request() req: any,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException("No puedes editar este usuario");
    }

    return this.usersService.update(id, body);
  }
}
