import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../common/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { Expert, ExpertSchema } from 'src/common/schemas/experts.schema';
import { User, UserSchema } from 'src/common/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Expert.name, schema: ExpertSchema },
      { name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      })
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule { }
