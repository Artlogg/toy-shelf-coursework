import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

interface DemoAccount {
  login: string;
  passwordHash: string;
  role: 'guest' | 'client' | 'admin';
}

@Injectable()
export class AuthService {
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
    if (dto.role === 'guest') {
      return {
        token: 'demo-guest-token',
        role: 'guest',
        login: 'guest',
      };
    }

    const account = this.accounts.find((item) => item.login === dto.login && item.role === dto.role);
    if (!account || !bcrypt.compareSync(dto.password, account.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: `demo-${account.role}-token`,
      role: account.role,
      login: account.login,
    };
  }
}

