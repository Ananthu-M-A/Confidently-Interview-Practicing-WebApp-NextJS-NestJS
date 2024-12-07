import { Body, Controller, Get, Patch, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from 'src/common/schemas/users.schema';
import { AdminService } from './admin.service';
import { Admin } from '../common/schemas/admin.schema';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Expert } from 'src/common/schemas/experts.schema';

@Controller('api/admin')
export class AdminController {

    constructor(private readonly adminService: AdminService, private readonly configService: ConfigService) { }

    // @Post('register')
    // async createUser(@Body() userData: Admin) {
    //     return this.adminService.registerUser(userData);
    // }

    @Post('login')
    async adminLogin(@Body() adminData: Partial<Admin>) {
        return this.adminService.adminLogin(adminData)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async authenticateAdmin(@Request() req) {
        return req.user;
    }

    @Get('users')
    getUsers(): Promise<User[]> {
        return this.adminService.getUsers()
    }

    @Patch('user')
    updateUserStatus(@Body() userData: Partial<User>): Promise<Partial<User>> {
        return this.adminService.updateUserStatus(userData)
    }

    @Get('experts')
    getExperts(): Promise<Expert[]> {
        return this.adminService.getExperts()
    }

    @Patch('expert')
    updateExpertStatus(@Body() expertData: Partial<Expert>): Promise<Expert> {
        return this.adminService.updateExpertStatus(expertData)
    }

    @Post('expert')
    addExpert(@Body() expertData: Partial<Expert>) {
        return this.adminService.addExpert(expertData)
    }

    @Get('interviews')
    getInterviewData() {
        return this.adminService.getInterviewData()
    }

    @Get('stats')
    getStatistics() {
        return this.adminService.getStatistics()
    }
}
