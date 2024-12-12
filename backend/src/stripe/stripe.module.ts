import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/users.schema';
import { Subscription, SubscriptionSchema } from 'src/common/schemas/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ])],
  providers: [StripeService],
  exports: [StripeService],
  controllers: [StripeController]
})
export class StripeModule { }
