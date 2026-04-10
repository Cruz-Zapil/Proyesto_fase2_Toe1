import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return { message: `Get user ${id} - implementar` };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() dto: any) {
    return { message: `Update user ${id} - implementar` };
  }
}
