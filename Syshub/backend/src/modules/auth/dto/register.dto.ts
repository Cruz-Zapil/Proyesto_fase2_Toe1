import { IsEmail, IsNotEmpty, IsUUID, Min, min, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @MinLength(2)
  apellidos: string;
  
  @IsNotEmpty()
  @MinLength(11)
  telefono: string;

  @IsNotEmpty()
  @MinLength(9)
  registro_academico: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsUUID()
  @IsNotEmpty()
  carreraId: string;
}