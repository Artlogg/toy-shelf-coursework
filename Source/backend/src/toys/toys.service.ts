import { Injectable } from '@nestjs/common';
import { Toy } from './toy.entity';

@Injectable()
export class ToysService {
  private readonly toys: Toy[] = [
    {
      id: 'blocks',
      title: 'Конструктор Builder Box',
      category: 'Развивающие',
      price: 1490,
      available: true,
      stock: 14,
      rating: 4.8,
      description: 'Набор ярких деталей для развития логики, моторики и фантазии.',
      image: '/images/blocks.png',
    },
    {
      id: 'teddy',
      title: 'Плюшевый медведь Bruno',
      category: 'Мягкие',
      price: 990,
      available: true,
      stock: 9,
      rating: 4.7,
      description: 'Мягкая игрушка с приятной тканью и аккуратной вышивкой.',
      image: '/images/teddy.png',
    },
    {
      id: 'car',
      title: 'Радиоуправляемая машина Sprint',
      category: 'Техника',
      price: 2490,
      available: true,
      stock: 5,
      rating: 4.6,
      description: 'Игрушечная машина с пультом управления и прочным корпусом.',
      image: '/images/car.png',
    },
    {
      id: 'robot',
      title: 'Интерактивный робот Byte',
      category: 'Техника',
      price: 3290,
      available: true,
      stock: 4,
      rating: 4.9,
      description: 'Робот с подсветкой, звуками и демонстрационными режимами игры.',
      image: '/images/robot.png',
    },
    {
      id: 'doll',
      title: 'Кукла Mia',
      category: 'Куклы',
      price: 1790,
      available: true,
      stock: 7,
      rating: 4.5,
      description: 'Кукла с комплектом одежды и аксессуарами для сюжетной игры.',
      image: '/images/doll.png',
    },
    {
      id: 'puzzle',
      title: 'Пазл Ocean 500',
      category: 'Развивающие',
      price: 690,
      available: true,
      stock: 18,
      rating: 4.4,
      description: 'Пазл на 500 деталей для спокойной семейной сборки.',
      image: '/images/puzzle.png',
    },
    {
      id: 'dino',
      title: 'Динозавр Rex',
      category: 'Фигурки',
      price: 1190,
      available: true,
      stock: 11,
      rating: 4.6,
      description: 'Фигурка динозавра для коллекции и сюжетных игр.',
      image: '/images/dino.png',
    },
    {
      id: 'ball',
      title: 'Мяч Active Kids',
      category: 'Спорт',
      price: 590,
      available: false,
      stock: 0,
      rating: 4.3,
      description: 'Легкий игровой мяч для активных занятий дома и на улице.',
      image: '/images/ball.png',
    },
  ];

  findAll(): Toy[] {
    return this.toys;
  }
}
