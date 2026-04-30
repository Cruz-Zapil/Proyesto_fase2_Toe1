import { Controller, Get, Param, ParseUUIDPipe} from '@nestjs/common';
import { CarrerasService } from './carreras.service';



@Controller()
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}

  // GET /api/v1/carreras
  @Get('carreras')
  findAll() {
    return this.carrerasService.findAll();
  }

  // GET /api/v1/carreras/:id
  @Get('carreras/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.carrerasService.findById(id);
  }

  //  GET /api/v1/divisiones/:id/carreras
  @Get('divisiones/:id/carreras')
  findByDivision(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.carrerasService.findByDivision(id);
  }





  
}