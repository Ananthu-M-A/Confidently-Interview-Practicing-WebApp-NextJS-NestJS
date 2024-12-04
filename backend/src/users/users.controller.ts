import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../common/schemas/users.schema';


@Controller('api/user')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get('profile/:userId')
    async viewUser(@Param('userId') userId: string): Promise<Partial<User>> {
        return this.usersService.viewUser(userId);
    }

    @Put('profile/:userId')
    async updateExpert(
        @Param('userId') userId: string,
        @Body() userData: Partial<User>): Promise<Partial<User>> {
        console.log(userId, userData);

        return this.usersService.updateUser(userId, userData);
    }

    @Get('list-experts')
    listExperts(@Query('formData') formData: string,) {
        return this.usersService.loadExperts(formData)
    }

    @Post('interview')
    scheduleInterview(@Body() formData: { difficulty: string, time: string }) {
        return this.usersService.scheduleInterview(formData)
    }

    @Get('interview-dates/:userId')
    listDates(@Param('userId') userId: string) {
        return this.usersService.fetchDates(userId);
    }

}
