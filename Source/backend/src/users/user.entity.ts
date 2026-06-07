export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  age?: number;
}

export type PublicUser = Omit<User, 'passwordHash'>;
