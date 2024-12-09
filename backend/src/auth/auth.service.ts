import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { LoginCredDto } from 'src/common/dto/login-cred.dto';
import { SignupCredDto } from 'src/common/dto/signup-cred.dto';
import { User, UserDocument } from 'src/common/schemas/users.schema';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        private readonly emailService: EmailService,
    ) { }

    async userRegister(userData: SignupCredDto): Promise<{ token: string }> {
        try {
            const { email } = userData;
            let user = await this.userModel.findOne({ email });
            if (user) {
                throw new ConflictException("Email already registered");
            }
            user = new this.userModel(userData);
            await user.save();
            const payload = { username: user.fullname, sub: user._id };
            return { token: this.jwtService.sign(payload) };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            console.log("Registration Error:", error);
            throw new InternalServerErrorException(`Registration Error`)
        }

    }

    async userLogin(userData: LoginCredDto): Promise<{ token: string }> {
        try {
            const { email, password } = userData;
            const user = await this.userModel.findOne({ email });

            if (!user) {
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            }

            const passwordMatched = await compare(password, user.password);

            if (!passwordMatched) {
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            }

            const payload = { username: user.fullname, sub: user._id };
            return { token: this.jwtService.sign(payload) };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            console.log("Login Error:", error);
            throw new InternalServerErrorException(`Login Error`)
        }

    }

    async resetPassword(userData: Partial<User>): Promise<String> {
        try {
            const { email } = userData;
            let user = await this.userModel.findOne({ email });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            Object.assign(user, { password: this.configService.get<string>('CONFIDENTLY_DEFAULT_PASSWORD') });
            await user.save();
            await this.emailService.sendResetMail(user.email);
            return;
        } catch (error) {
            console.log("Reset Password Error:", error);
            throw new InternalServerErrorException(`Reset Password Error`)
        }

    }
}
