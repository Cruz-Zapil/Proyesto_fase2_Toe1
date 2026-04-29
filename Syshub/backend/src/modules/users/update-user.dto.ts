

import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  nombre?: string;

  @IsOptional()
  apellidos?: string;

  @IsOptional()
  telefono?: string;


  @IsOptional()
  @MinLength(6)
  password?: string;
}