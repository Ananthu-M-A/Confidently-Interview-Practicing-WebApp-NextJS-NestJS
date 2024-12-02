interface Availability {
    date: string;
    slots: string[];
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpertDocument = Expert & Document;

@Schema({ timestamps: true })
export class Expert {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    fullname: string;

    @Prop()
    specialization: string;

    @Prop()
    yearsOfExperience: string;

    @Prop({ type: [{ type: Object, required: true }], _id: false })
    availability: Availability[];

    @Prop({ required: true, default: true })
    active: boolean;
}

export const ExpertSchema = SchemaFactory.createForClass(Expert);

ExpertSchema.pre('save', function (next) {
    this.password = this.password;
    next();
});
