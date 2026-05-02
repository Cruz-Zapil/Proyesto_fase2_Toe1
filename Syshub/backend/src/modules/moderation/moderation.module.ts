import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}
