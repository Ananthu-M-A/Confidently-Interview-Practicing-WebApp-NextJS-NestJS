import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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
      apiVersion: "2025-08-27.basil",
    });
  }

  async subscribe(userId: string): Promise<{ paymentUrl: string }> {
    try {

      const user = await this.userModel.findOne(
        { _id: userId },
        { _id: 0, email: 1, subscription: 1 }
      );

      if (!user) {
        throw new UnauthorizedException("User not found")
      }

      if (user.subscription) {
        throw new ConflictException("Subscription already active")
      }

      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: this.configService.get<string>('STRIPE_PRICE_ID_MONTHLY'),
            quantity: 1,
          }
        ],
        customer_email: user.email,
        success_url: `${this.configService.get<string>(`FRONTEND_URL`)}/user/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>(`FRONTEND_URL`)}/user/subscriptions`
      })
      return { paymentUrl: session.url };
    } catch (error) {
      console.log(error);
      throw new Error(`Stripe Error Occured, Try again later`)
    }
  }

  async successPayment(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(
        JSON.parse(sessionId)
      );
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 30);
      const { customer_email, subscription, amount_total, currency } = session;

      const existingSubscription = await this.subscriptionModel.findOne({
        subscriptionId: subscription.toString(),
      });

      if (existingSubscription) {
        return { message: "Subscription already processed." };
      }

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
      });

      await newSubscription.save();
      await this.userModel.updateOne(
        { _id: user._id },
        { subscription: newSubscription._id }
      );

      return { message: "Payment Successful" };
    } catch (error) {
      console.error(error);
      throw new Error("Stripe Error Occurred, Try again later");
    }
  }
}