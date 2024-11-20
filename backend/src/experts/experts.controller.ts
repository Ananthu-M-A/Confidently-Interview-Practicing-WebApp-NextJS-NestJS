import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Expert } from '../common/schemas/experts.schema';
import { ExpertsService } from './experts.service';

@Controller('experts')
export class ExpertsController {

    constructor(private readonly expertsService: ExpertsService) { }

    @Post('login')
    loginExpert(@Body() expertData: Partial<Expert>) {
        return this.expertsService.loginExpert(expertData);
    }

    @Get('me')
    viewExpert() {
        return this.expertsService.viewExpert();
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
