import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {

    @Prop({ ref: 'Expert', required: true })
    expertId: Types.ObjectId;

    @Prop({ ref: 'Interview', required: true })
    interviewId: Types.ObjectId;

    @Prop({ required: true })
    totalScore: number;

    @Prop([{ type: String, required: true }])
    strengths: string[];

    @Prop([{ type: String, required: true }])
    areasOfImprovement: string[];

    @Prop({ required: true })
    comments: string;

}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
