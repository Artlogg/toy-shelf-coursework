export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  age?: number;
  role?: 'client' | 'admin';
}

export type PublicUser = Omit<User, 'passwordHash'>;
