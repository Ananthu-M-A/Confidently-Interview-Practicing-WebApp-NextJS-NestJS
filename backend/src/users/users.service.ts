import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/common/schemas/users.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) { }

    viewUser() {

    }

    updateUser() {

    }

    scheduleInterview() {

    }

    viewInterviews() {

    }

}
