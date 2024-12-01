import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expert, ExpertDocument } from '../common/schemas/experts.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ExpertsService {

    constructor(
        @InjectModel(Expert.name) private readonly expertModel: Model<ExpertDocument>,
        private readonly jwtService: JwtService
    ) {}

    async loginExpert(expertData: Partial<Expert>): Promise<{ expert: Partial<ExpertDocument>; token: string } | null> {
        const { email, password } = expertData;
        const expert = await this.expertModel.findOne({ email });

        if (!expert) return null;

        const passwordMatched = await compare(password, expert.password);
        
        if (!passwordMatched) return null;

        const payload = { username: expert.fullname, sub: expert._id };
        return {
            expert: {
                id: expert._id,
                email: expert.email,
                fullname: expert.fullname,
                specialization: expert.specialization,
                yearsOfExperience: expert.yearsOfExperience,
                availability: expert.availability,
                active: expert.active,
            },
            token: this.jwtService.sign(payload),
        };
    }

    async logoutExpert(email: string): Promise<string> {
        // Implement token invalidation logic if needed (e.g., add to blacklist or session store)
        return "User logged out successfully.";
    }

    async updateExpert(expertId: string, updateData: Partial<Expert>): Promise<Expert> {
        return this.expertModel.findByIdAndUpdate(expertId, updateData, { new: true });
    }

    async updateAvailability(expertId: string, availability: any[]): Promise<Expert> {
        return this.expertModel.findByIdAndUpdate(
            expertId,
            { availability },
            { new: true }
        );
    }

    async viewInterviews(expertId: string): Promise<any[]> {
        return [];
    }

    async submitFeedback(interviewId: string, feedback: any): Promise<string> {
        return `Feedback for interview ${interviewId} submitted.`;
    }
}