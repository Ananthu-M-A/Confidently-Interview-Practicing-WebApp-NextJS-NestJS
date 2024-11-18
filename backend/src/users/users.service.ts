import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from 'src/users/users.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    async createUser(userData: Partial<User>): Promise<User> {
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

    async logoutUser(): Promise<String> {
        return "User logged out"
    }

    viewUser() {

    }

    updateUser() {

    }

    scheduleInterview() {

    }

    viewInterviews() {

    }

}
