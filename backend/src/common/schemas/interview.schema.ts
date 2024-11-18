import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InterviewDocument = HydratedDocument<Interview>;

@Schema({ timestamps: true })
export class Interview {

    @Prop({ ref: 'Expert', required: true })
    expertId: Types.ObjectId;

    @Prop({ ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true })
    subjectStatus: string;

}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
