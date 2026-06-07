import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ToysModule } from './toys/toys.module';

@Module({
  imports: [UsersModule, AuthModule, ToysModule],
})
export class AppModule {}

