import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
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

    @Get('interviews/:userId')
    async getInterviews(
        @Query('slot') slot: string,
        @Param('userId') userId: string,
    ) {
        return this.usersService.getInterviews(slot, userId);
    }

    @Post('interview/:userId')
    async scheduleInterview(
        @Body() formData: { difficulty: string, time: string },
        @Param('userId') userId: string,
        @Query('expertId') expertId: string,
    ) {
        return this.usersService.scheduleInterview(formData, expertId, userId)
    }

    @Get('interview-dates/:userId')
    getDates(@Param('userId') userId: string) {
        return this.usersService.getDates(userId);
    }

    @Get('latest-interview/:userId')
    loadLatestInterview(@Param('userId') userId: string) {
        return this.usersService.loadLatestInterview(userId);
    }

    @Patch('interview/:interviewId/cancel')
    cancelInterview(@Param('interviewId') interviewId: string) {
        return this.usersService.cancelInterview(interviewId);
    }

    @Get('current-plan/:userId')
    findPlan(@Param('userId') userId: string) {
        return this.usersService.findPlan(userId);
    }
}
