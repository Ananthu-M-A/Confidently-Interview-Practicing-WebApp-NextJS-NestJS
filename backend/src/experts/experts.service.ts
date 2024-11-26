import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expert, ExpertDocument } from '../common/schemas/experts.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ExpertsService {

    constructor(@InjectModel(Expert.name) private readonly expertModel: Model<ExpertDocument>, private readonly jwtService: JwtService,) { }

    // async registerUser(userData: Partial<Expert>): Promise<{ user: Partial<ExpertDocument>; token: string }> {
    //     const { email } = userData;
    //     let user = await this.expertModel.findOne({ email });
    //     if (user) {
    //         Object.assign(user, userData);
    //         await user.save();
    //         throw new Error("Email already exists");
    //     } else {
    //         let {password} = userData;
    //         userData.password = await hash(password,10);
    //         user = new this.expertModel(userData);
    //         await user.save();
    //     }
    //     const payload = { username: user.fullname, sub: user._id };
    //     return {
    //         user: {
    //             id: user._id,
    //             fullname: user.fullname,
    //             email: user.email,
    //             specialization: 'SW',
    //             yearsOfExperience: 5,
    //             availability:[],
    //             active: user.active
    //         },
    //         token: this.jwtService.sign(payload)
    //     };
    // }

    async loginExpert(expertData: Partial<Expert>): Promise<Object> {
        const { email, password } = expertData;
        const expert = await this.expertModel.findOne({ email });
        if (!expert) {
            return null;
        }
        const passwordMatched = await compare(password, expert.password);

        if (!passwordMatched) {
            return null;
        }
        const payload = { username: expert.fullname, sub: expert._id };
        return {
            user: {
                id: expert._id,
                email: expert.email,
                fullname: expert.fullname,
                specialization: expert.specialization,
                yearsOfExperience: expert.yearsOfExperience,
                availability: expert.availability,
                active: expert.active
            },
            token: this.jwtService.sign(payload)
        };
    }

    async logoutExpert(email: string): Promise<String> {
        return "User logged out"
    }

    async validateExpert(expertData: Partial<Expert>): Promise<object> {
        const { email, password } = expertData;
        const existingExpert = await this.expertModel.findOne({ email });
        if (!existingExpert) {
            return null;
        }
        const passwordMatched = await compare(password, existingExpert.password);

        if (!passwordMatched) {
            return null;
        }
        return { username: existingExpert.email, id: existingExpert._id };
    }

    viewExpert() {

    }

    updateExpert() {

    }

    updateAvailability() {

    }

    viewInterviews() {

    }

    submitFeedback() {

    }

}
