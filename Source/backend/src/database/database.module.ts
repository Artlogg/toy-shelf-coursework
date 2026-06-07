import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [
    {
      provide: DatabaseService,
      useFactory: async () => {
        const service = new DatabaseService();
        return service.init();
      },
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
