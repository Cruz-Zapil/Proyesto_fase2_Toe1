import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';
import { Curso } from './curso.entity';
import { CarrerasModule } from '../carreras/carreras.module';

@Module({
  imports: [TypeOrmModule.forFeature([Curso]), CarrerasModule],
  controllers: [CursoController],
  providers: [CursoService],
  exports: [CursoService],
})
export class CursoModule {}