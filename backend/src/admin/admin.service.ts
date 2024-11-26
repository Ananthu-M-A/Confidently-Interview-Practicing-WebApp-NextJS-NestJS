import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../common/schemas/admin.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {

    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>, private readonly jwtService: JwtService) { }

    // async registerUser(userData: Partial<Admin>): Promise<{ user: Partial<AdminDocument>; token: string }> {
    //     const { email } = userData;
    //     let user = await this.adminModel.findOne({ email });
    //     if (user) {
    //         Object.assign(user, userData);
    //         await user.save();
    //         throw new Error("Email already exists");
    //     } else {
    //         let { password } = userData;
    //         userData.password = await hash(password, 10);
    //         user = new this.adminModel(userData);
    //         await user.save();
    //     }
    //     const payload = { username: user.email, sub: user._id };
    //     return {
    //         user: {
    //             id: user._id,
    //             email: user.email,
    //         },
    //         token: this.jwtService.sign(payload)
    //     };
    // }

    async loginAdmin(adminData: Partial<Admin>): Promise<Object> {
        const { email, password } = adminData;
        const admin = await this.adminModel.findOne({ email });
        if (!admin) {
            return null;
        }
        const passwordMatched = await compare(password, admin.password);

        if (!passwordMatched) {
            return null;
        }
        const payload = { username: admin.email, sub: admin._id };
        return {
            user: {
                id: admin._id,
                email: admin.email,
            },
            token: this.jwtService.sign(payload)
        };
    }

    async logoutAdmin(email: string): Promise<String> {
        return "Admin logged out"
    }

    async validateAdmin(adminData: Partial<Admin>): Promise<object> {
        const { email, password } = adminData;
        const existingAdmin = await this.adminModel.findOne({ email });
        if (!existingAdmin) {
            return null;
        }
        const passwordMatched = await compare(password, existingAdmin.password);

        if (!passwordMatched) {
            return null;
        }
        return { username: existingAdmin.email, id: existingAdmin._id };
    }

    viewUsers() {

    }

    updateUser() {

    }

    viewExperts() {

    }

    updateExpert() {

    }

    addExpert() {

    }

    getInterviewData() {

    }

    getStatistics() {

    }

}
