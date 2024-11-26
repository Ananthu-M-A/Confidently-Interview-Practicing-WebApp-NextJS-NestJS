import { Module } from '@nestjs/common';
import { ExpertsController } from './experts.controller';
import { ExpertsService } from './experts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expert, ExpertSchema } from '../common/schemas/experts.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Expert.name, schema: ExpertSchema }]),
  JwtModule.registerAsync({
    useFactory: () => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  }),],
  controllers: [ExpertsController],
  providers: [ExpertsService],
  exports: [ExpertsService]
})
export class ExpertsModule { }

