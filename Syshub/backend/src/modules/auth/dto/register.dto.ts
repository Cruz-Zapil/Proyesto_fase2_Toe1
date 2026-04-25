import { IsEmail, IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsUUID()
  @IsNotEmpty()
  carreraId: string;
}