import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUser, User } from './user.entity';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  age: number | null;
  role_id: 'client' | 'admin';
}

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): PublicUser[] {
    return this.database
      .all<UserRow>('SELECT id, name, email, password_hash, age, role_id FROM users ORDER BY created_at DESC')
      .map((user) => this.toPublicUser(this.fromRow(user)));
  }

  findOne(id: string): PublicUser {
    return this.toPublicUser(this.getUserById(id));
  }

  findByEmail(email: string): User | undefined {
    const row = this.database.one<UserRow>(
      'SELECT id, name, email, password_hash, age, role_id FROM users WHERE lower(email) = lower(?)',
      [email],
    );
    return row ? this.fromRow(row) : undefined;
  }

  create(dto: CreateUserDto): PublicUser {
    const email = dto.email.toLowerCase();
    const exists = this.database.one('SELECT id FROM users WHERE lower(email) = lower(?)', [email]);
    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const id = randomUUID();
    this.database.run(
      'INSERT INTO users (id, name, email, password_hash, age, role_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, dto.name.trim(), email, bcrypt.hashSync(dto.password, 10), dto.age ?? null, 'client', new Date().toISOString()],
    );

    return this.findOne(id);
  }

  remove(id: string): PublicUser {
    const user = this.getUserById(id);
    this.database.run('DELETE FROM users WHERE id = ?', [id]);
    return this.toPublicUser(user);
  }

  private getUserById(id: string): User {
    const row = this.database.one<UserRow>(
      'SELECT id, name, email, password_hash, age, role_id FROM users WHERE id = ?',
      [id],
    );
    if (!row) {
      throw new NotFoundException('User not found');
    }
    return this.fromRow(row);
  }

  private fromRow(row: UserRow): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      age: row.age ?? undefined,
      role: row.role_id,
    };
  }

  private toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
