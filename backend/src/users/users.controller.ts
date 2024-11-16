import { Body, Controller, Get, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Post('register')
    createUser(@Body() user: { fullName, emailId, password }) {
        return user
    }

    @Post('login')
    loginUser(@Body() user: { emailId, password }) {
        return user
    }

    @Post('logout')
    logoutUser() {
        return []
    }

    @Get('me')
    viewUser() {
        return []
    }

    @Put('me')
    updateUser(@Body() user:{}) {
        return user
    }

    @Post('interview')
    scheduleInterview(){
        return []
    }

    @Get('interview')
    viewInterviews(){
        return []
    }

}
