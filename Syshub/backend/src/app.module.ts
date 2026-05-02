import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// Modules
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { ForumsModule } from "./modules/forums/forums.module";
import { AdminModule } from "./modules/admin/admin.module";
import { ArticulosModule } from "./modules/articles/articulos.module";

// carrera
import { CarrerasModule } from "./modules/carreras/carreras.module";
import { DivisionesModule } from "./modules/division/division.module";

// Config
import { typeOrmConfig } from "./config/typeorm.config";
import { CursoModule } from "./modules/curso/curso.module";
import { ModerationModule } from "./modules/moderation/moderation.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    ProjectsModule,
    ForumsModule,
    AdminModule,
    DivisionesModule,
    CarrerasModule,
    CursoModule,
    ArticulosModule,
    ModerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
