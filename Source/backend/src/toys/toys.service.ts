import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { Toy } from './toy.entity';

export interface CheckoutItem {
  toyId: string;
  quantity: number;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  userId?: string;
  customerEmail?: string;
}

interface ToyRow {
  id: string;
  title: string;
  category: string;
  price: number;
  available: number;
  stock: number;
  rating: number;
  description: string;
  image: string;
}

interface OrderRow {
  id: string;
  user_id: string | null;
  customer_email: string | null;
  total: number;
  status: string;
  created_at: string;
}

interface OrderItemView {
  toyId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface OrderView {
  id: string;
  userId: string | null;
  customerEmail: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItemView[];
}

@Injectable()
export class ToysService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): Toy[] {
    return this.database
      .all<ToyRow>('SELECT id, title, category, price, available, stock, rating, description, image FROM toys ORDER BY title')
      .map((toy) => this.fromToyRow(toy));
  }

  findOrders(): OrderView[] {
    const orders = this.database.all<OrderRow>('SELECT id, user_id, customer_email, total, status, created_at FROM orders ORDER BY created_at DESC');
    return orders.map((order) => ({
      id: order.id,
      userId: order.user_id,
      customerEmail: order.customer_email,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      items: this.database.all<OrderItemView>(
        'SELECT toy_id as toyId, title, quantity, price FROM order_items WHERE order_id = ? ORDER BY title',
        [order.id],
      ),
    }));
  }

  checkout(payload: CheckoutPayload) {
    const items = payload.items || [];
    if (!items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const normalizedItems = items.map((item) => ({
      toyId: item.toyId,
      quantity: Number(item.quantity),
    }));

    for (const item of normalizedItems) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new BadRequestException('Quantity must be a positive integer');
      }
    }

    const orderId = randomUUID();
    let total = 0;

    this.database.transaction(() => {
      for (const item of normalizedItems) {
        const toy = this.database.one<ToyRow>(
          'SELECT id, title, category, price, available, stock, rating, description, image FROM toys WHERE id = ?',
          [item.toyId],
        );
        if (!toy) {
          throw new BadRequestException(`Toy ${item.toyId} not found`);
        }
        if (toy.stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${toy.title}`);
        }
        total += toy.price * item.quantity;
      }

      this.database.run(
        'INSERT INTO orders (id, user_id, customer_email, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, payload.userId ?? null, payload.customerEmail ?? null, total, 'created', new Date().toISOString()],
      );

      for (const item of normalizedItems) {
        const toy = this.database.one<ToyRow>(
          'SELECT id, title, category, price, available, stock, rating, description, image FROM toys WHERE id = ?',
          [item.toyId],
        );
        if (!toy) {
          continue;
        }
        this.database.run('UPDATE toys SET stock = stock - ?, available = CASE WHEN stock - ? > 0 THEN 1 ELSE 0 END WHERE id = ?', [
          item.quantity,
          item.quantity,
          item.toyId,
        ]);
        this.database.run('INSERT INTO order_items (id, order_id, toy_id, title, quantity, price) VALUES (?, ?, ?, ?, ?, ?)', [
          randomUUID(),
          orderId,
          toy.id,
          toy.title,
          item.quantity,
          toy.price,
        ]);
      }
    });

    return {
      orderId,
      total,
      toys: this.findAll(),
    };
  }

  private fromToyRow(row: ToyRow): Toy {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      price: row.price,
      available: Boolean(row.available),
      stock: row.stock,
      rating: row.rating,
      description: row.description,
      image: row.image,
    };
  }
}
