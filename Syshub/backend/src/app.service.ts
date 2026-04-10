import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Syshub API v1.0',
      version: '0.0.1',
      timestamp: new Date().toISOString(),
    };
  }
}
