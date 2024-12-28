import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { time } from 'console';
import { Model, ObjectId } from 'mongoose';
import { ExpertDTO } from 'src/common/dtos/expert.dto';
import { UserDTO } from 'src/common/dtos/user.dto';
import { ExpertDocument } from 'src/common/schemas/experts.schema';
import { InterviewDocument } from 'src/common/schemas/interview.schema';
import { User, UserDocument } from 'src/common/schemas/users.schema';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        @InjectModel('Expert') private readonly expertModel: Model<ExpertDocument>,
        @InjectModel('Interview') private readonly interviewModel: Model<InterviewDocument>,
        private readonly stripeService: StripeService
    ) { }

    async getUser(userId: string): Promise<Partial<UserDTO>> {
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
            const startOfDay = new Date(date);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setUTCHours(23, 59, 59, 999);
            const experts = await this.expertModel.find({
                specialization: subject,
                active: true
            }, {
                fullname: 1,
                specialization: 1,
                availability: 1,
            }).exec();
            const result = experts
                .map((expert) => {
                    const availableSlots = expert.availability.filter(
                        (slot) => slot >= startOfDay && slot <= endOfDay,
                    );
                    return { id: expert._id, fullname: expert.fullname, availableSlots };
                })
                .filter((entry) => entry.availableSlots.length > 0);
            return result;
        } catch (error) {
            console.log("Loading Experts Error:", error);
            throw new InternalServerErrorException(`Loading Experts Error`)
        }

    }

    async getDates(userId: string): Promise<string[]> {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            const dates = await this.interviewModel.find(
                { userId: user._id, status: "scheduled" },
                { _id: 0, time: 1 }
            );
            const uniqueDates = Array.from(
                new Set(dates.map(date => new Date(date.time).toISOString().split('T')[0]))
            );
            return uniqueDates;
        } catch (error) {
            console.log("Loading Dates Error:", error);
            throw new InternalServerErrorException(`Loading Dates Error`)
        }
    }

    async scheduleInterview(formData: { difficulty: string, time: string }, expertId: string, userId: string) {
        try {
            const { time, difficulty } = formData;
            const user = await this.userModel.findOne({ _id: userId }, { _id: 1 });
            const expert = await this.expertModel.findOne({ _id: expertId }, { _id: 1, specialization: 1 });
            const newInterview = new this.interviewModel({
                expertId: expert._id,
                userId: user._id,
                subject: expert.specialization,
                time: new Date(time),
                difficulty,
                status: "scheduled"
            })
            await newInterview.save();

            await this.expertModel.findByIdAndUpdate(expertId, { $pull: { availability: new Date(time) } });

            return newInterview;
        } catch (error) {
            console.log("Scheduling Interview Error:", error);
            throw new InternalServerErrorException(`Scheduling Interview Error`)
        }

    }

    async getInterviews(date: string, userId: string) {
        try {
            const inputDate = new Date(date);
            const timeZoneOffset = inputDate.getTimezoneOffset() * 60000;
            const startOfDay = new Date(inputDate.getTime() - timeZoneOffset);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(inputDate.getTime() - timeZoneOffset);
            endOfDay.setUTCHours(23, 59, 59, 999);
            const user = await this.userModel.findOne({ _id: userId });
            const interviews = await this.interviewModel.find({
                userId: user._id,
                status: "scheduled",
                time: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() },
            }).populate('expertId');
            return interviews.map((interview) => ({
                id: interview._id,
                expertId: interview.expertId,
                time: interview.time,
                difficulty: interview.difficulty,
                status: interview.status,
            }));
        } catch (error) {
            console.error("Loading Interviews Error:", error);
            throw new InternalServerErrorException(`Loading Interviews Error`);
        }
    }

    async loadLatestInterview(userId: string) {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            const latestInterview = await this.interviewModel.find(
                {
                    userId: user._id,
                    $or: [
                        { status: "scheduled" },
                        { status: "active" },
                    ],
                }
            ).sort({ time: 1 }).limit(1);
            const expert = await this.expertModel.findOne(
                { _id: latestInterview[0].expertId },
                { _id: 0, fullname: 1 }
            );
            return {
                subject: latestInterview[0].subject,
                date: new Date(latestInterview[0].time).toDateString(),
                time: new Date(latestInterview[0].time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                status: latestInterview[0].status,
                expertName: expert.fullname
            };
        } catch (error) {
            console.error("Cancelling Interview Error:", error);
            throw new InternalServerErrorException(`Cancelling Interview Error`);
        }
    }

    async cancelInterview(interviewId: string) {
        try {
            const interview = await this.interviewModel.findOne({ _id: interviewId });
            await this.interviewModel.updateOne({
                _id: interview._id
            }, {
                $set: { status: "cancelled" }
            });

            await this.expertModel.findByIdAndUpdate(
                { _id: interview.expertId },
                { $push: { availability: interview.time } });
            return { message: "Interview Cancelled" }
        } catch (error) {
            console.error("Cancelling Interview Error:", error);
            throw new InternalServerErrorException(`Cancelling Interview Error`);
        }
    }

    async findPlan(userId: string): Promise<{ subscription: boolean }> {
        try {
            const user = await this.userModel.findOne({
                _id: userId
            }, {
                _id: 0, subscription: 1
            });
            if (!user) {
                throw new UnauthorizedException(`User not found`);
            }
            if (user.subscription) {
                return { subscription: true };
            } else {
                return { subscription: false };
            }
        } catch (error) {
            console.error("Finding Subscription Error:", error);
            throw new InternalServerErrorException(`Finding Subscription Error`);
        }
    }

}