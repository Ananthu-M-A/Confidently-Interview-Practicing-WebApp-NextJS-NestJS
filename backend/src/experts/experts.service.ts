import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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
    ) { }

    async getExpert(expertId: string): Promise<object> {
        const expert = await this.expertModel.findOne({ _id: expertId });
        return { fullname: expert.fullname, email: expert.email, specialization: expert.specialization, yearsOfExperience: expert.yearsOfExperience };
    }

    async expertLogin(expertData: Partial<Expert>): Promise<{ expert: Partial<ExpertDocument>; token: string } | null> {
        const { email, password } = expertData;
        const expert = await this.expertModel.findOne({ email });

        if (!expert) throw new UnauthorizedException();

        const passwordMatched = await compare(password, expert.password);

        if (!passwordMatched) throw new UnauthorizedException();

        const payload = { username: expert.fullname, sub: expert._id };
        return {
            expert: {
                id: expert._id,
                email: expert.email,
                fullname: expert.fullname,
                active: expert.active,
            },
            token: this.jwtService.sign(payload),
        };
    }

    async updateExpert(expertId: string, updateData: Partial<Expert>): Promise<object> {
        const expert = await this.expertModel.findByIdAndUpdate(expertId, updateData, { new: true });
        return { id: expert._id }
    }

    async updateAvailability(expertId: string, slot: string): Promise<object> {
        const expert = await this.expertModel.findById(expertId);
        const newSlot = new Date(slot);
        
        const bookedSlots = expert.availability.some((existingSlot: Date) => {
            const existingSlotTime = new Date(existingSlot).getTime();
            const newSlotTime = newSlot.getTime();
            return Math.abs(existingSlotTime - newSlotTime) < 60 * 60 * 1000;
        });
            
        if (bookedSlots) {
            throw new ConflictException();
        }

        const updateExpert = await this.expertModel.findByIdAndUpdate(expertId, { $push: { availability: newSlot } });
        return updateExpert.availability;
    }    

    async viewInterviews(expertId: string): Promise<any[]> {
        return [];
    }

    async submitFeedback(interviewId: string, feedback: any): Promise<string> {
        return `Feedback for interview ${interviewId} submitted.`;
    }
}