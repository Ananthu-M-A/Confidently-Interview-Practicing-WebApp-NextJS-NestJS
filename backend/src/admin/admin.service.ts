import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../common/schemas/admin.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Expert, ExpertDocument } from 'src/common/schemas/experts.schema';
import { User, UserDocument } from 'src/common/schemas/users.schema';
import { EmailService } from 'src/email/email.service';
import { Interview, InterviewDocument } from 'src/common/schemas/interview.schema';
import { ConfigService } from '@nestjs/config';
import { LoginCredDTO } from 'src/common/dtos/login-cred.dto';
import { UserDTO } from 'src/common/dtos/user.dto';
import { ExpertDTO } from 'src/common/dtos/expert.dto';
import { StatsDTO } from 'src/common/dtos/stats.dto';


@Injectable()
export class AdminService {

    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
        @InjectModel(Expert.name) private readonly expertModel: Model<ExpertDocument>, @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Interview.name) private readonly interviewModel: Model<InterviewDocument>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService) { }

    async adminLogin(adminData: LoginCredDTO): Promise<{ token: string }> {
        try {
            const { email, password } = adminData;
            const admin = await this.adminModel.findOne({ email });
            if (!admin) {
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            }
            const passwordMatched = await compare(password, admin.password);
            if (!passwordMatched) {
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            }
            const payload = { username: admin.email, sub: admin._id };
            const token = this.jwtService.sign(payload);
            return { token };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            console.log("Login Error:", error);
            throw new InternalServerErrorException(`Login Error`)
        }
    }

    async getUsers(): Promise<UserDTO[]> {
        try {
            let users = await this.userModel.find({},
                { _id: 0, fullname: 1, email: 1, subscription: 1, active: 1 });
            if (!users) {
                return [];
            }
            return users;
        } catch (error) {
            console.log("Loading Users Error:", error);
            throw new InternalServerErrorException(`Loading Users Error`)
        }
    }

    async updateUserStatus(userData: UserDTO): Promise<Partial<UserDTO>> {
        try {
            const { email } = userData;
            let existingUser = await this.userModel.findOne({ email });
            if (!existingUser) {
                throw new NotFoundException(`User not found`);
            }
            Object.assign(existingUser, { active: !existingUser.active });
            await existingUser.save();
            return { email: existingUser.email };
        } catch (error) {
            console.log("User Status Updation Error:", error);
            throw new InternalServerErrorException(`User Status Updation Error`);
        }

    }

    async getExperts(): Promise<ExpertDTO[]> {
        try {
            let experts = await this.expertModel.find({},
                { _id: 0, fullname: 1, email: 1, specialization: 1, active: 1 });
            if (!experts) {
                return [];
            }
            return experts;
        } catch (error) {
            console.log("Loading Experts Error:", error);
            throw new InternalServerErrorException(`Loading Experts Error`)
        }

    }

    async updateExpertStatus(expertData: Partial<ExpertDTO>): Promise<Partial<ExpertDTO>> {
        try {
            const { email } = expertData;
            let existingExpert = await this.expertModel.findOne({ email });
            if (!existingExpert) {
                throw new NotFoundException(`Expert not found`);
            }
            Object.assign(existingExpert, { active: !existingExpert.active });
            await existingExpert.save();
            return { email: existingExpert.email };
        } catch (error) {
            console.log("Expert Status Updation Error:", error);
            throw new InternalServerErrorException(`Expert Status Updation Error`);
        }

    }

    async addExpert(expertData: ExpertDTO): Promise<Expert> {
        try {
            const { email, fullname, yearsOfExperience } = expertData;
            let existingExpert = await this.expertModel.findOne({ email });
            if (existingExpert) {
                throw new ConflictException(`Email already registered`);
            }
            const password = "Expert@" + yearsOfExperience + fullname.substring(0, 3);
            const hashedPassword = await hash(password, 10);
            await this.emailService.sendExpertMail(email, password);
            Object.assign(expertData, { password: hashedPassword })
            const newExpert = new this.expertModel(expertData);
            await newExpert.save();
            return (newExpert);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            console.log("Adding New Expert Error:", error);
            throw new InternalServerErrorException(`Adding New Expert Error:`)
        }

    }

    getInterviewData() {
        try {

        } catch (error) {

        }
    }

    async getStatistics(): Promise<StatsDTO> {
        try {
            const totalUsers = await this.userModel.countDocuments();
            const totalExperts = await this.expertModel.countDocuments();
            const totalInterviews = await this.interviewModel.countDocuments();
            const totalProUsers = await this.userModel.find({ subscription: true }).countDocuments();
            const avgRating = 4.5;
            const totalRevanue = totalProUsers * this.configService.get<number>('SUBSCRIPTION_FEE');
            return { totalUsers, totalExperts, totalInterviews, avgRating, totalRevanue };
        } catch (error) {
            console.log("Loading Stats Error:", error);
            throw new InternalServerErrorException(`Loading Stats Error:`)
        }

    }
}
