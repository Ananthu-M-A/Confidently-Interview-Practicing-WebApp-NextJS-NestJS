import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { ExpertDocument } from 'src/common/schemas/experts.schema';
import { User, UserDocument } from 'src/common/schemas/users.schema';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        @InjectModel('Expert') private readonly expertModel: Model<ExpertDocument>,
    ) { }

    async viewUser(userId: string): Promise<object> {
        const user = await this.userModel.findOne({ _id: userId });
        return { fullname: user.fullname, email: user.email };
    }

    async updateUser(userId: string, userData: Partial<User>): Promise<object> {
        const { password } = userData;
        userData.password = await hash(password, 10);
        const user = await this.userModel.findByIdAndUpdate(userId, userData, { new: true });
        return { id: user._id }
    }

    async loadExperts(formData: string) {
        const { subject, difficulty, date } = JSON.parse(formData);
        const experts = await this.expertModel.find({ specialization: subject }, { fullname: 1, availability: 1, specialization: 1 });
        return experts;
    }

    scheduleInterview() {

    }

    viewInterviews() {

    }

}
