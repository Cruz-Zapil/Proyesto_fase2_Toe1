import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  async findAll() {
    return [];
  }

  async findOne(id: string) {
    return null;
  }

  async create(data: any) {
    return { id: 'nuevo-proyecto' };
  }
}
