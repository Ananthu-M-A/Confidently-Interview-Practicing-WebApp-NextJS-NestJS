import { NotAcceptableException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop()
    fullname: string

    @Prop({ ref: 'Subscription'})
    subscription: Types.ObjectId

    @Prop({ required: true, default: true })
    active: boolean

}


export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const hashedPassword = await hash(this.password, 10)
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        console.error(error);
        next(new Error('Error hashing the password'));
    }
});