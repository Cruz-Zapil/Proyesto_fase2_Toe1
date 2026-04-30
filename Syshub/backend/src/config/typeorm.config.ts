import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'syshub_v2',
  synchronize: false,
   logging: true, // opcional, pero útil
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '**', '*.{ts,js}')],
  subscribers: [join(__dirname, '..', 'subscribers', '**', '*.{ts,js}')],
};