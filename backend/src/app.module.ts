import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpertsModule } from './experts/experts.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, ExpertsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
