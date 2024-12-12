import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../common/schemas/users.schema';


@Controller('api/user')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get('profile/:userId')
    async getUser(@Param('userId') userId: string) {
        return this.usersService.getUser(userId);
    }

    @Put('profile/:userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body() userData: Partial<User>) {
        return this.usersService.updateUser(userId, userData);
    }

    @Get('experts')
    async getExperts(@Query('formData') formData: string) {
        return this.usersService.getExperts(formData)
    }

    @Get('interviews')
    async getInterviews(
        @Query('slot') slot: string,
        @Query('userId') userId: string,
    ) {
        return this.usersService.getInterviews(slot, userId);
    }

    @Post('interview')
    async scheduleInterview(@Body() formData: { difficulty: string, time: string }) {
        return this.usersService.scheduleInterview(formData)
    }

    @Get('interview-dates/:userId')
    getDates(@Param('userId') userId: string) {
        return this.usersService.getDates(userId);
    }

    @Get('current-plan/:userId')
    findPlan(@Param('userId') userId: string) {
        return this.usersService.findPlan(userId);
    }
}
