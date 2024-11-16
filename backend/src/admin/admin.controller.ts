import { Body, Controller, Get, Post, Put } from '@nestjs/common';

@Controller('admin')
export class AdminController {

    @Post('login')
    loginAdmin(@Body() user: { emailId, password }) {
        return user
    }

    @Get('users')
    viewUsers() {
        return []
    }

    @Put('users')
    updateUser(@Body() user:{}) {
        return user
    }

    @Get('experts')
    viewExperts() {
        return []
    }

    @Put('experts')
    updateExpert(@Body() expert:{}) {
        return expert
    }

    @Post('experts')
    addExpert(@Body() expert:{}){
        return expert
    }

    @Get('interviews')
    getInterviewData() {
        return []
    }

    @Get('stat')
    getStatistics() {
        return []
    }
}
