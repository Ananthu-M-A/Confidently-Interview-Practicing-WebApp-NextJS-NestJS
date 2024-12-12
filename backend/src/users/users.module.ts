import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../common/schemas/users.schema';
import { Expert, ExpertSchema } from 'src/common/schemas/experts.schema';
import { Interview, InterviewSchema } from 'src/common/schemas/interview.schema';
import { StripeModule } from 'src/stripe/stripe.module';
import { Subscription, SubscriptionSchema } from 'src/common/schemas/subscription.schema';

@Module({
  imports: [
    StripeModule,
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Expert.name, schema: ExpertSchema },
    { name: Interview.name, schema: InterviewSchema },
    { name: Subscription.name, schema: SubscriptionSchema },

  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule]
})
export class UsersModule { }
