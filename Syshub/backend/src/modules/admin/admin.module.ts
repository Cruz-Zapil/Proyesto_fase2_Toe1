import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Division } from '../division/division.entity';
import { Carrera } from '../carreras/carrera.entity';
import { Curso } from '../curso/curso.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Division, Carrera, Curso])],
  providers: [AdminService, AdminRoleGuard],
  controllers: [AdminController],
})
export class AdminModule {}