import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsIn(['client', 'admin'])
  role!: 'client' | 'admin';
}
