import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop()
    fullname: string

    @Prop({ required: true, default: false })
    subscription: boolean

    @Prop({ required: true, default: true })
    active: boolean

}

export const UserSchema = SchemaFactory.createForClass(User);
