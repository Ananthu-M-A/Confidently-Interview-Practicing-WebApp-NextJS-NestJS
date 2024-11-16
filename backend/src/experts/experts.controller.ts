import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

@Controller('experts')
export class ExpertsController {

    @Post('login')
    loginExpert(@Body() expert: { emailId, password }) {
        return expert
    }

    @Get('me')
    viewExpert() {
        return []
    }

    @Put('me')
    updateExpert(@Body() expert:{}) {
        return expert
    }

    @Put('availability')
    updateAvailability(@Body() expert:{}) {
        return expert
    }

    @Get('interviews')
    viewInterviews() {
        return []
    }

    @Post('interviews/:interview_id/feedback')
    submitFeedback(@Param('interview_id') interview_id: string) {
        return interview_id
    }

}
