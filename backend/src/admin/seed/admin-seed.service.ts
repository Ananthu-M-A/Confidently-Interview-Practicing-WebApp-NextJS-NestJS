import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from '../../common/schemas/admin.schema';

@Injectable()
export class AdminSeedService implements OnModuleInit {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) { }

    async onModuleInit() {
        const adminExists = await this.adminModel.findOne({ email: 'admin@confidently.com' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Pswd4@dmin', 10);
            await this.adminModel.create({
                email: 'admin@confidently.com',
                password: hashedPassword,
            });
            console.log('✅ Default admin created: admin@confidently.com / Pswd4@dmin');
        }
    }
}
