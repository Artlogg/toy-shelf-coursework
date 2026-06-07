import { Controller, Get } from '@nestjs/common';
import { Toy } from './toy.entity';
import { ToysService } from './toys.service';

@Controller('toys')
export class ToysController {
  constructor(private readonly toysService: ToysService) {}

  @Get()
  findAll(): Toy[] {
    return this.toysService.findAll();
  }
}

