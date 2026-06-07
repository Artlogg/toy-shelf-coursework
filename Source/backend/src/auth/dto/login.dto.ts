import { IsIn, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsString()
  @ValidateIf((dto: LoginDto) => dto.role !== 'guest')
  @IsNotEmpty()
  login!: string;

  @IsString()
  @ValidateIf((dto: LoginDto) => dto.role !== 'guest')
  @MinLength(6)
  password!: string;

  @IsIn(['guest', 'client', 'admin'])
  role!: 'guest' | 'client' | 'admin';
}
