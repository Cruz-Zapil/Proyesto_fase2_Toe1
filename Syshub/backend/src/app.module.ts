import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ForumsModule } from './modules/forums/forums.module';
import { AdminModule } from './modules/admin/admin.module';

// carrera
import { CarrerasModule } from './modules/carreras/carreras.module';

// Config
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
  AuthModule,
    UsersModule,
    ProjectsModule,
    ForumsModule,
    AdminModule,
    CarrerasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
