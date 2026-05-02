

import { IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  telefono?: string;

  @IsOptional()
  telefono_casa?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}