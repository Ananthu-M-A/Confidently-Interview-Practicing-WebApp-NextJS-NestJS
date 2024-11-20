import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../common/schemas/admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {

    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>) { }

    async loginAdmin(adminData: Partial<Admin>): Promise<String> {
        const { email, password } = adminData;
        const admin = await this.adminModel.findOne({ email });
        if (!admin) {
            throw new Error("Email not registered");
        }
        if (admin.password !== password) {
            throw new Error("Password not correct");
        }
        return "Admin logged in";
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
