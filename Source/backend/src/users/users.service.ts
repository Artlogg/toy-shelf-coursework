import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUser, User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: randomUUID(),
      name: 'Артур Кадыров',
      email: 'artur@example.com',
      passwordHash: bcrypt.hashSync('artur123', 10),
      age: 19,
    },
    {
      id: randomUUID(),
      name: 'Demo Client',
      email: 'client@example.com',
      passwordHash: bcrypt.hashSync('client123', 10),
    },
  ];

  findAll(): PublicUser[] {
    return this.users.map((user) => this.toPublicUser(user));
  }

  findOne(id: string): PublicUser {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toPublicUser(user);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  }

  create(dto: CreateUserDto): PublicUser {
    const email = dto.email.toLowerCase();
    const exists = this.users.some((item) => item.email.toLowerCase() === email);
    if (exists) {
      throw new ConflictException('Email already exists');
    }
    const user: User = {
      id: randomUUID(),
      name: dto.name.trim(),
      email,
      passwordHash: bcrypt.hashSync(dto.password, 10),
      age: dto.age,
    };
    this.users.push(user);
    return this.toPublicUser(user);
  }

  remove(id: string): PublicUser {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    const [removed] = this.users.splice(index, 1);
    return this.toPublicUser(removed);
  }

  private toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
