import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../common/schemas/users.schema';


@Controller('api/user')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get('interviews')
    async getInterviews() {
        return this.usersService.getInterviews();
    }

    @Post('interview')
    async scheduleInterview(@Body() formData: { difficulty: string, time: string }) {
        return this.usersService.scheduleInterview(formData)
    }

    @Get('experts')
    async getExperts(@Query('formData') formData: string,) {
        return this.usersService.getExperts(formData)
    }

    @Get('interview-dates/:userId')
    getDates(@Param('userId') userId: string) {
        return this.usersService.getDates(userId);
    }

    @Get('profile/:userId')
    async getUser(@Param('userId') userId: string): Promise<Partial<User>> {
        return this.usersService.getUser(userId);
    }

    @Put('profile/:userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body() userData: Partial<User>): Promise<Partial<User>> {
        console.log(userId, userData);
        return this.usersService.updateUser(userId, userData);
    }

}
