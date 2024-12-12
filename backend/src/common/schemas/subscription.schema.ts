import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {

    @Prop({ ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    subscriptionId: string

    @Prop({ required: true })
    startDate: Date

    @Prop({ required: true })
    endDate: Date

    @Prop({ required: true, enum: ["active", "canceled", "paused", "expired"], default: "active" })
    status: string

    @Prop({ required: true })
    currency: string

    @Prop({ required: true })
    amount: number
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
