import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from '../../common/schemas/admin.schema';

@Injectable()
export class AdminSeedService implements OnModuleInit {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) { }

    async onModuleInit() {
        const adminEmail = process.env.CONFIDENTLY_ADMIN_EMAIL || 'admin@confidently.com';
        const adminPassword = process.env.CONFIDENTLY_ADMIN_PASSWORD || 'Pswd4@dmin';
        const adminExists = await this.adminModel.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await this.adminModel.create({
                email: adminEmail,
                password: hashedPassword,
            });
            console.log(`Default Admin Created: ${adminEmail} / ${adminPassword}`);
        }
    }
}
