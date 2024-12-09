import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { UserDto } from 'src/common/dto/user.dto';
import { ExpertDocument } from 'src/common/schemas/experts.schema';
import { InterviewDocument } from 'src/common/schemas/interview.schema';
import { User, UserDocument } from 'src/common/schemas/users.schema';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        @InjectModel('Expert') private readonly expertModel: Model<ExpertDocument>,
        @InjectModel('Interview') private readonly interviewModel: Model<InterviewDocument>,
    ) { }

    async getUser(userId: string): Promise<Partial<UserDto>> {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            return { fullname: user.fullname, email: user.email };
        } catch (error) {
            console.log("Profile Loading Error:", error);
            throw new InternalServerErrorException(`Profile Loading Error`)
        }

    }

    async updateUser(userId: string, userData: Partial<User>): Promise<object> {
        try {
            const { password } = userData;
            userData.password = await hash(password, 10);
            const user = await this.userModel.findByIdAndUpdate(userId, userData, { new: true });
            return { id: user._id }
        } catch (error) {
            console.log("Profile Updation Error:", error);
            throw new InternalServerErrorException(`Profile Updation Error`)
        }

    }

    async getExperts(formData: string) {
        try {
            const { subject, date } = JSON.parse(formData);
            const experts = await this.expertModel.find({ specialization: subject }, { fullname: 1, availability: 1, specialization: 1 });
            return experts;
        } catch (error) {
            console.log("Loading Experts Error:", error);
            throw new InternalServerErrorException(`Loading Experts Error`)
        }

    }

    async getDates(userId: string) {
        try {
            const dates = await this.interviewModel.find({ userId }, { _id: 0, time: 1 });
            return dates;
        } catch (error) {
            console.log("Loading Dates Error:", error);
            throw new InternalServerErrorException(`Loading Dates Error`)
        }
    }

    async scheduleInterview(formData: { difficulty: string, time: string }) {
        try {
            const { time, difficulty } = formData;
            const newInterview = new this.interviewModel({
                expertId: "1",
                userId: "2",
                time,
                difficulty,
                status: "scheduled"
            })
            await newInterview.save();
            return newInterview;
        } catch (error) {
            console.log("Scheduling Interview Error:", error);
            throw new InternalServerErrorException(`Scheduling Interview Error`)
        }

    }

    async getInterviews() {
        try {

        } catch (error) {
            console.log("Loading Interviews Error:", error);
            throw new InternalServerErrorException(`Loading Interviews Error`)
        }
    }

}
