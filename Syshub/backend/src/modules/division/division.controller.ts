import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { DivisionService } from './division.service';

@Controller('divisiones')
export class DivisionController {
  constructor(private readonly divisionesService: DivisionService) {}

  // GET /api/v1/divisiones
  @Get()
  findAll() {
    return this.divisionesService.findAll();
  }

  // GET /api/v1/divisiones/:id
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.divisionesService.findById(id);
  }
}