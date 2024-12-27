import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InterviewDocument = Interview & Document;

@Schema({ timestamps: true })
export class Interview {

    @Prop({ ref: 'Expert', required: true })
    expertId: Types.ObjectId;

    @Prop({ ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    time: Date;

    @Prop({ required: true })
    difficulty: string;

    @Prop({ required: true })
    status: string;

}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
