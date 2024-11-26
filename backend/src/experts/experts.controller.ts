import { Body, Controller, Get, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Expert } from '../common/schemas/experts.schema';
import { ExpertsService } from './experts.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('api/expert')
export class ExpertsController {

    constructor(private readonly expertsService: ExpertsService, private readonly configService: ConfigService) { }

    // @Post('register')
    // async createUser(@Body() userData: Expert) {
    //     return this.expertsService.registerUser(userData);
    // }

    @Post('login')
    async enterExpert(@Body() expertData: Partial<Expert>) {      
        const expert = await this.expertsService.validateExpert(expertData);
        if (!expert) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.expertsService.loginExpert(expertData);
    }

    @Post('logout')
    async exitExert(@Body() email: string) {
        return this.expertsService.logoutExpert(email);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async checkUserOnline(@Request() req) {
        return req.user;
    }

    @Put('me')
    updateExpert(@Body() expert: Expert) {
        return this.expertsService.updateExpert();
    }

    @Post('availability')
    updateAvailability(@Body() expert: {}) {
        return this.expertsService.updateAvailability();
    }

    @Get('interviews')
    viewInterviews() {
        return this.expertsService.viewInterviews();
    }

    @Post('interviews/:interview_id/feedback')
    submitFeedback(@Param('interview_id') interview_id: string) {
        return this.expertsService.submitFeedback();
    }

}
