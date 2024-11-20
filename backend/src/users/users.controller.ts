import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../common/schemas/users.schema';


@Controller('api/users')
export class UsersController {

    constructor(private usersService: UsersService) { }

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
