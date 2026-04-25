import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hilo } from './hilo.entity';
import { Comentario } from './comentario.entity';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hilo, Comentario])],
  providers: [ForumsService],
  controllers: [ForumsController],
  exports: [ForumsService],
})


export class ForumsModule {}
