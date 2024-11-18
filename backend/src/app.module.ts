import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ExpertsModule } from './experts/experts.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './common/modules/database.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ExpertsModule,
    AdminModule
  ],
})
export class AppModule { }
