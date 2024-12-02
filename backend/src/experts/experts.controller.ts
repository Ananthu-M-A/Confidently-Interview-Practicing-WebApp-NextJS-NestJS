import { Body, Controller, Get, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Expert } from '../common/schemas/experts.schema';
import { ExpertsService } from './experts.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('api/expert')
export class ExpertsController {
    constructor(
        private readonly expertsService: ExpertsService,
        private readonly configService: ConfigService
    ) { }

    @Get('profile/:expertId')
    async viewExpert(@Request() req, @Param('expertId') expertId: string) {
        console.log(expertId);
        return this.expertsService.viewExpert();
    }

    @Put('profile')
    async updateExpert(@Request() req, @Body() expertData: Partial<Expert>) {
        return this.expertsService.updateExpert(req.user.id, expertData);
    }

    @Post('login')
    async enterExpert(@Body() expertData: Partial<Expert>) {
        return this.expertsService.loginExpert(expertData);
    }

    @Post('logout')
    async exitExpert(@Body('email') email: string) {
        return this.expertsService.logoutExpert(email);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async checkUserOnline(@Request() req) {
        return req.user;
    }

    @Post('availability')
    async updateAvailability(@Request() req, @Body('availability') availability: any[]) {
        return this.expertsService.updateAvailability(req.user.id, availability);
    }

    @Get('interviews')
    async viewInterviews(@Request() req) {
        return this.expertsService.viewInterviews(req.user.id);
    }

    @Post('interviews/:interview_id/feedback')
    async submitFeedback(
        @Param('interview_id') interviewId: string,
        @Body('feedback') feedback: any
    ) {
        return this.expertsService.submitFeedback(interviewId, feedback);
    }
}