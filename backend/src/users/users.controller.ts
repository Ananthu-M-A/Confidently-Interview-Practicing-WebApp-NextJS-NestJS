import { Body, Controller, Get, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Post('register')
    createUser(@Body() user: { fullname, email, password }) {
        return user
    }

    @Post('login')
    loginUser(@Body() user: { email, password }) {
        return user
    }

    @Post('logout')
    logoutUser() {
        return []
    }

    @Get('me')
    viewUser() {
        return {}
    }

    @Put('me')
    updateUser(@Body() user:{}) {
        return user
    }

    @Post('interview')
    scheduleInterview(){
        return []
    }

    @Get('interviews')
    viewInterviews(){
        return []
    }

}
