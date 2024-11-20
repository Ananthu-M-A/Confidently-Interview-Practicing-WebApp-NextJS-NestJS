import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ExpertsModule } from './experts/experts.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './common/modules/database.module';
import { AuthModule } from './auth/auth.module';
import { EnvConfigModule } from './common/modules/config.module';

@Module({
  imports: [
    DatabaseModule,
    EnvConfigModule,
    UsersModule,
    ExpertsModule,
    AdminModule,
    AuthModule,
    AppModule
  ],
})
export class AppModule { }
