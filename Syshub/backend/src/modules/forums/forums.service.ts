import { Injectable } from '@nestjs/common';

@Injectable()
export class ForumsService {
  async getThreads() {
    return [];
  }

  async createThread(data: any) {
    return { id: 'nuevo-hilo' };
  }

  async addComment(threadId: string, data: any) {
    return { id: 'nuevo-comentario' };
  }
}
