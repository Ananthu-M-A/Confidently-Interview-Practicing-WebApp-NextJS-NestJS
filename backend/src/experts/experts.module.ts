import { Module } from '@nestjs/common';
import { ExpertsController } from './experts.controller';
import { ExpertsService } from './experts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expert, ExpertSchema } from '../common/schemas/experts.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Expert.name, schema: ExpertSchema }])],
  controllers: [ExpertsController],
  providers: [ExpertsService],
  exports: [ExpertsService]
})
export class ExpertsModule { }

