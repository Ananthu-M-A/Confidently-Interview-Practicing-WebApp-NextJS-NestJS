import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';

@Injectable()
export class AuthService {

    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) { }

    async registerUser(userData: User): Promise<UserDocument> {
        const { email } = userData;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async loginUser(userData: Partial<User>): Promise<String> {
        const { email, password } = userData;
        const existingUser = await this.userModel.findOne({ email });
        if (!existingUser) {
            throw new Error("Email not registered");
        }
        if (existingUser.password !== password) {
            throw new Error("Password not correct");
        }
        return "User logged in";
    }

    async logoutUser(email: string): Promise<String> {
        return "User logged out"
    }

    async resetUser(email: string): Promise<String> {
        return "User logged out"
    }

}
