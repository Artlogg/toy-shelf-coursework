import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { PublicUser } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): PublicUser[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): PublicUser {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto): PublicUser {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): PublicUser {
    return this.usersService.remove(id);
  }
}
