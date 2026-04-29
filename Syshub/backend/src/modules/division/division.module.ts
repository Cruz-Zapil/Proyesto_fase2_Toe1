import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from './division.entity';
import { DivisionController } from './division.controller';
import { DivisionService } from './division.service';

@Module({
  imports: [TypeOrmModule.forFeature([Division])],
  controllers: [DivisionController],
  providers: [DivisionService],
  exports: [DivisionService],
})
export class DivisionesModule {}