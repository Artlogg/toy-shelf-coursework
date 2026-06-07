import { Body, Controller, Get, Post } from '@nestjs/common';
import { Toy } from './toy.entity';
import { CheckoutPayload, ToysService } from './toys.service';

@Controller('toys')
export class ToysController {
  constructor(private readonly toysService: ToysService) {}

  @Get()
  findAll(): Toy[] {
    return this.toysService.findAll();
  }

  @Get('orders')
  findOrders() {
    return this.toysService.findOrders();
  }

  @Post('checkout')
  checkout(@Body() payload: CheckoutPayload) {
    return this.toysService.checkout(payload || { items: [] });
  }
}
