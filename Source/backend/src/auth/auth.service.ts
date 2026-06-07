import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

interface DemoAccount {
  login: string;
  passwordHash: string;
  role: 'guest' | 'client' | 'admin';
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private readonly accounts: DemoAccount[] = [
    {
      login: 'admin',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
    },
    {
      login: 'client',
      passwordHash: bcrypt.hashSync('client123', 10),
      role: 'client',
    },
  ];

  login(dto: LoginDto) {
    if (dto.role === 'admin') {
      const account = this.accounts.find((item) => item.login === dto.login && item.role === 'admin');
      if (!account || !bcrypt.compareSync(dto.password, account.passwordHash)) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return {
        token: 'demo-admin-token',
        role: 'admin',
        login: account.login,
      };
    }

    const user = this.usersService.findByEmail(dto.login);
    if (!user || !user.passwordHash || !bcrypt.compareSync(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      token: `profile-${user.id}`,
      role: 'client',
      login: user.email,
      user: this.usersService.findOne(user.id),
    };
  }
}
