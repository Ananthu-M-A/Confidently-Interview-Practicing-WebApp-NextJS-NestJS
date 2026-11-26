import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from '../../common/schemas/admin.schema';

const MIN_PASSWORD_LENGTH = 12;

@Injectable()
export class AdminSeedService implements OnModuleInit {
    private readonly logger = new Logger(AdminSeedService.name);

    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) { }

    async onModuleInit() {
        const adminEmail = process.env.CONFIDENTLY_ADMIN_EMAIL?.trim();
        const adminPassword = process.env.CONFIDENTLY_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            this.logger.warn('CONFIDENTLY_ADMIN_EMAIL / CONFIDENTLY_ADMIN_PASSWORD not set; skipping admin seeding');
            return;
        }

        if (adminPassword.length < MIN_PASSWORD_LENGTH) {
            this.logger.warn(`CONFIDENTLY_ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters; skipping admin seeding`);
            return;
        }

        const adminExists = await this.adminModel.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            await this.adminModel.create({
                email: adminEmail,
                password: hashedPassword,
            });
            this.logger.log(`Default admin created: ${adminEmail}`);
        }
    }
}
