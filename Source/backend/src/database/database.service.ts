import { Injectable } from '@nestjs/common';
import initSqlJs, { Database, SqlValue } from 'sql.js';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface QueryResult {
  [key: string]: SqlValue;
}

@Injectable()
export class DatabaseService {
  private db!: Database;

  async init() {
    const SQL = await initSqlJs();
    this.db = new SQL.Database();
    this.createSchema();
    this.seedData();
    return this;
  }

  run(sql: string, params: SqlValue[] = []) {
    this.db.run(sql, params);
  }

  all<T = QueryResult>(sql: string, params: SqlValue[] = []): T[] {
    const statement = this.db.prepare(sql, params);
    const rows: T[] = [];
    while (statement.step()) {
      rows.push(statement.getAsObject() as unknown as T);
    }
    statement.free();
    return rows;
  }

  one<T = QueryResult>(sql: string, params: SqlValue[] = []): T | undefined {
    return this.all<T>(sql, params)[0];
  }

  transaction(action: () => void) {
    this.run('BEGIN TRANSACTION');
    try {
      action();
      this.run('COMMIT');
    } catch (error) {
      this.run('ROLLBACK');
      throw error;
    }
  }

  private createSchema() {
    this.db.run(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE roles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL
      );

      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        age INTEGER,
        role_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );

      CREATE TABLE toys (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        available INTEGER NOT NULL,
        stock INTEGER NOT NULL,
        rating REAL NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
      );

      CREATE TABLE orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        customer_email TEXT,
        total INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        toy_id TEXT NOT NULL,
        title TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (toy_id) REFERENCES toys(id)
      );
    `);
  }

  private seedData() {
    const now = new Date().toISOString();
    this.run('INSERT INTO roles (id, name, description) VALUES (?, ?, ?)', ['client', 'client', 'Покупатель магазина']);
    this.run('INSERT INTO roles (id, name, description) VALUES (?, ?, ?)', ['admin', 'admin', 'Администратор магазина']);

    this.run(
      'INSERT INTO users (id, name, email, password_hash, age, role_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [randomUUID(), 'Артур Кадыров', 'artur@example.com', bcrypt.hashSync('artur123', 10), 19, 'client', now],
    );
    this.run(
      'INSERT INTO users (id, name, email, password_hash, age, role_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [randomUUID(), 'Demo Client', 'client@example.com', bcrypt.hashSync('client123', 10), null, 'client', now],
    );

    const toys = [
      ['subaru', 'Subaru Drift 4WD', 'Машинки', 2490, 1, 8, 4.8, 'Радиоуправляемая машина для дрифта Subaru 4WD длиной 21 см.', '/images/subaru.jpg'],
      ['robot', 'Робот Vector', 'Роботы', 3490, 1, 6, 4.9, 'Интерактивный робот с гусеницами, подсветкой и характерным дизайном.', '/images/robot.jpg'],
      ['doll', 'Кукла Candy', 'Куклы', 1290, 1, 10, 4.6, 'Мягкая кукла с ярким платьем в горошек и розовыми волосами.', '/images/doll.jpg'],
      ['earth-puzzle', 'Пазл Planet Earth', 'Пазлы', 990, 1, 12, 4.7, 'Круглый пазл с изображением Земли, 500 деталей.', '/images/puzzle.jpg'],
      ['dino', 'Плюшевый динозавр Rex', 'Мягкие игрушки', 1190, 1, 7, 4.5, 'Мягкий зеленый динозавр для игры и коллекции.', '/images/dino.jpg'],
    ];

    for (const toy of toys) {
      this.run(
        'INSERT INTO toys (id, title, category, price, available, stock, rating, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        toy,
      );
    }
  }
}
