import { BadRequestException, Injectable } from '@nestjs/common';
import { Toy } from './toy.entity';

export interface CheckoutItem {
  toyId: string;
  quantity: number;
}

@Injectable()
export class ToysService {
  private readonly toys: Toy[] = [
    {
      id: 'subaru',
      title: 'Subaru Drift 4WD',
      category: 'Машинки',
      price: 2490,
      available: true,
      stock: 8,
      rating: 4.8,
      description: 'Радиоуправляемая машина для дрифта Subaru 4WD длиной 21 см.',
      image: '/images/subaru.jpg',
    },
    {
      id: 'robot',
      title: 'Робот Vector',
      category: 'Роботы',
      price: 3490,
      available: true,
      stock: 6,
      rating: 4.9,
      description: 'Интерактивный робот с гусеницами, подсветкой и характерным дизайном.',
      image: '/images/robot.jpg',
    },
    {
      id: 'doll',
      title: 'Кукла Candy',
      category: 'Куклы',
      price: 1290,
      available: true,
      stock: 10,
      rating: 4.6,
      description: 'Мягкая кукла с ярким платьем в горошек и розовыми волосами.',
      image: '/images/doll.jpg',
    },
    {
      id: 'earth-puzzle',
      title: 'Пазл Planet Earth',
      category: 'Пазлы',
      price: 990,
      available: true,
      stock: 12,
      rating: 4.7,
      description: 'Круглый пазл с изображением Земли, 500 деталей.',
      image: '/images/puzzle.jpg',
    },
    {
      id: 'dino',
      title: 'Плюшевый динозавр Rex',
      category: 'Мягкие игрушки',
      price: 1190,
      available: true,
      stock: 7,
      rating: 4.5,
      description: 'Мягкий зеленый динозавр для игры и коллекции.',
      image: '/images/dino.jpg',
    },
  ];

  findAll(): Toy[] {
    return this.toys;
  }

  checkout(items: CheckoutItem[]) {
    if (!items.length) {
      throw new BadRequestException('Cart is empty');
    }

    for (const item of items) {
      const toy = this.toys.find((candidate) => candidate.id === item.toyId);
      if (!toy) {
        throw new BadRequestException(`Toy ${item.toyId} not found`);
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new BadRequestException('Quantity must be a positive integer');
      }
      if (toy.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for ${toy.title}`);
      }
    }

    let total = 0;
    for (const item of items) {
      const toy = this.toys.find((candidate) => candidate.id === item.toyId);
      if (!toy) {
        continue;
      }
      toy.stock -= item.quantity;
      toy.available = toy.stock > 0;
      total += toy.price * item.quantity;
    }

    return {
      orderId: Date.now().toString(),
      total,
      toys: this.toys,
    };
  }
}
