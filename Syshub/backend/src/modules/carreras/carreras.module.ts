import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrera } from './carrera.entity';
import { UsuarioCarrera } from './usuario_carrera.entity';
import { CarrerasService } from './carreras.service';
import { CarrerasController } from './carreras.controller';
import { Curso } from '../curso/curso.entity';

@Module({
  
    imports: [
    TypeOrmModule.forFeature([Carrera, UsuarioCarrera, Curso])
    // forFeature registra las entidades para que el repositorio
    // de TypeORM esté disponible dentro de este módulo
  ],
  
  providers: [CarrerasService], // servicios disponibles dentro del modulo
  controllers: [CarrerasController], // controladores que exponen las rutas / endpoints
  exports: [CarrerasService, TypeOrmModule], // exportamos para que authModulo pueda usar UsuarioCarrera
})
export class CarrerasModule {}

