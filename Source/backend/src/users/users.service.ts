import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: randomUUID(), name: 'Артур Кадыров', email: 'artur@example.com', age: 19 },
    { id: randomUUID(), name: 'Demo Client', email: 'client@example.com' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  create(dto: CreateUserDto): User {
    const email = dto.email.toLowerCase();
    const exists = this.users.some((item) => item.email.toLowerCase() === email);
    if (exists) {
      throw new ConflictException('Email already exists');
    }
    const user: User = {
      id: randomUUID(),
      name: dto.name.trim(),
      email,
      age: dto.age,
    };
    this.users.push(user);
    return user;
  }
}

