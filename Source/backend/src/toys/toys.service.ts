import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Toy } from './toy.entity';

@Injectable()
export class ToysService {
  private readonly toys: Toy[] = [
    { id: randomUUID(), title: 'Конструктор', category: 'Развивающие', price: 1490, available: true },
    { id: randomUUID(), title: 'Плюшевый медведь', category: 'Мягкие', price: 990, available: true },
    { id: randomUUID(), title: 'Радиоуправляемая машина', category: 'Техника', price: 2490, available: false },
  ];

  findAll(): Toy[] {
    return this.toys;
  }
}

