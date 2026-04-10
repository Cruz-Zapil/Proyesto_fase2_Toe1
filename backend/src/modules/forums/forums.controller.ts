import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ForumsService } from './forums.service';

@Controller('forums')
export class ForumsController {
  constructor(private forumsService: ForumsService) {}

  @Get('threads')
  getThreads() {
    return { message: 'Get all threads - implementar' };
  }

  @Post('threads')
  createThread(@Body() dto: any) {
    return { message: 'Create thread - implementar' };
  }

  @Get('threads/:id')
  getThread(@Param('id') id: string) {
    return { message: `Get thread ${id} - implementar` };
  }

  @Post('threads/:id/comments')
  addComment(@Param('id') id: string, @Body() dto: any) {
    return { message: 'Add comment - implementar' };
  }
}
