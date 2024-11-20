import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expert, ExpertDocument } from '../common/schemas/experts.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExpertsService {

    constructor(@InjectModel(Expert.name) private readonly expertModel: Model<ExpertDocument>) { }

    async loginExpert(expertData:Partial<Expert>):Promise<String> {
        const { email, password } = expertData;
        const existingExpert = await this.expertModel.findOne({ email });
        if (!existingExpert) {
            throw new Error("Email not registered");
        }
        if (existingExpert.password !== password) {
            throw new Error("Password not correct");
        }
        return "Expert logged in";
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
