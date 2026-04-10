import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getUsers() {
    return [];
  }

  async updateUser(id: string, data: any) {
    return null;
  }

  async deleteUser(id: string) {
    return { deleted: true };
  }

  async getReports() {
    return [];
  }

  async getMetrics() {
    return {};
  }
}
