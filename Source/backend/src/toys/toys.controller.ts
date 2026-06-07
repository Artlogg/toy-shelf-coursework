import { Body, Controller, Get, Post } from '@nestjs/common';
import { Toy } from './toy.entity';
import { CheckoutItem, ToysService } from './toys.service';

@Controller('toys')
export class ToysController {
  constructor(private readonly toysService: ToysService) {}

  @Get()
  findAll(): Toy[] {
    return this.toysService.findAll();
  }

  @Post('checkout')
  checkout(@Body('items') items: CheckoutItem[]) {
    return this.toysService.checkout(items || []);
  }
}
