import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionDocument } from 'src/common/schemas/subscription.schema';
import { UserDocument } from 'src/common/schemas/users.schema';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Subscription') private readonly subscriptionModel: Model<SubscriptionDocument>,
    private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>(`STRIPE_SECRET_KEY`), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async subscribe(userId: string, plan: string): Promise<{ paymentUrl: string }> {
    try {

      const user = await this.userModel.findOne(
        { _id: userId },
        { _id: 0, email: 1 }
      );
      if (!user) {
        throw new UnauthorizedException("User not found")
      }
      if (!plan) {
        throw new Error("No plan found.");
      }

      let priceId: string;

      switch (JSON.parse(plan)) {
        case "monthly":
          priceId = this.configService.get<string>('STRIPE_PRICE_ID_MONTHLY');
          break;
        case "weekly":
          priceId = this.configService.get<string>('STRIPE_PRICE_ID_WEEKLY');
          break;
        default:
          throw new Error("No matching plan found.");
      }

      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          }
        ],
        customer_email: user.email,
        success_url: `${this.configService.get<string>(`FRONTEND_URL`)}/user/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>(`BACKEND_URL`)}/stripe/cancel`
      })
      return { paymentUrl: session.url };
    } catch (error) {
      console.log(error);
      throw new Error(`Stripe Error Occured, Try again later`)
    }
  }

  async successPayment(sessionId: string) {
    try {
      const session =
        await this.stripe.checkout.sessions.retrieve(JSON.parse(sessionId));
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 30);
      const { customer_email, subscription, amount_total, currency } = session;
      const user = await this.userModel.findOne(
        { email: customer_email },
        { _id: 1 }
      );

      const newSubscription = new this.subscriptionModel({
        userId: user._id,
        subscriptionId: subscription.toString(),
        startDate: currentDate,
        endDate: endDate,
        status: "active",
        currency,
        amount: amount_total / 100,
      })
      newSubscription.save();

      await this.userModel.updateOne({ _id: user._id }, { subscription: newSubscription._id });

      return { message: "Payment Successfull" };
    } catch (error) {
      console.log(error);
      throw new Error(`Stripe Error Occured, Try again later`)
    }
  }
}