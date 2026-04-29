import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './division.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DivisionService {
  constructor(
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
  ) {}

  async findAll() {
    return this.divisionRepository.find();
  }

  async findById(id: string) {
    const division = await this.divisionRepository.findOne({
      where: { id },
    });

    if (!division) {
      throw new NotFoundException('División no encontrada');
    }

    return division;
  }
}