import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ExpertsModule } from './experts/experts.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/confidently'),
    UsersModule,
    ExpertsModule,
    AdminModule
  ],
})
export class AppModule { }
