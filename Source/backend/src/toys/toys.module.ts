import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ToysController } from './toys.controller';
import { ToysService } from './toys.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ToysController],
  providers: [ToysService],
})
export class ToysModule {}
