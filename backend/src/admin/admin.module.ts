import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../common/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { Expert, ExpertSchema } from 'src/common/schemas/experts.schema';
import { User, UserSchema } from 'src/common/schemas/users.schema';
import { EmailModule } from 'src/email/email.module';
import { Interview, InterviewSchema } from 'src/common/schemas/interview.schema';
import { AdminSeedService } from './seed/admin-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Expert.name, schema: ExpertSchema },
      { name: User.name, schema: UserSchema },
      { name: Interview.name, schema: InterviewSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      })
    }),
    EmailModule
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminSeedService],
  exports: [AdminService]
})
export class AdminModule { }
