import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';


@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    createUser(@Body() userData: User) {
        return this.usersService.createUser(userData);
    }

    @Post('login')
    loginUser(@Body() userData: Partial<User>) {
        return this.usersService.loginUser(userData)
    }

    @Post('logout')
    logoutUser() {
        return this.usersService.logoutUser()
    }

    @Get('me')
    viewUser() {
        return this.usersService.viewUser()
    }

    @Put('me')
    updateUser(@Body() user: {}) {
        return this.usersService.updateUser()
    }

    @Post('interview')
    scheduleInterview() {
        return this.usersService.scheduleInterview()
    }

    @Get('interviews')
    viewInterviews() {
        return this.usersService.viewInterviews()
    }

}
