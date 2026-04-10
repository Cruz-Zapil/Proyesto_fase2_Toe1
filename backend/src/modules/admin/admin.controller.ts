import { Controller, Get, Param, Delete, Put, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return { message: 'Get all users - implementar' };
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: any) {
    return { message: `Update user ${id} - implementar` };
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return { message: `Delete user ${id} - implementar` };
  }

  @Get('reports')
  getReports() {
    return { message: 'Get reports - implementar' };
  }

  @Get('metrics')
  getMetrics() {
    return { message: 'Get metrics - implementar' };
  }
}
