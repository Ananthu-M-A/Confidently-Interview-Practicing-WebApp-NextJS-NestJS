import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InterviewDocument = HydratedDocument<Interview>;

@Schema({ timestamps: true })
export class Interview {

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

export const InterviewSchema = SchemaFactory.createForClass(Interview);
