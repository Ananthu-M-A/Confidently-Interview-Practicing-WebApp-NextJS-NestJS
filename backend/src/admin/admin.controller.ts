import { Body, Controller, Get, Patch, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from 'src/common/schemas/users.schema';
import { AdminService } from './admin.service';
import { Admin } from '../common/schemas/admin.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Expert } from 'src/common/schemas/experts.schema';
import { LoginCredDto } from 'src/common/dto/login-cred.dto';

@Controller('api/admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async authenticateAdmin(@Request() req) {
        if (!req.user) {
            throw new UnauthorizedException(`Authorization failed unexpectedly!`)
        }
        return req.user;
    }

    @Post('login')
    async adminLogin(@Body() adminData: LoginCredDto) {
        return this.adminService.adminLogin(adminData)
    }

    @Get('users')
    getUsers(): Promise<User[]> {
        return this.adminService.getUsers()
    }

    @Patch('user')
    updateUserStatus(@Body() userData: Partial<LoginCredDto>) {
        return this.adminService.updateUserStatus(userData)
    }

    @Get('experts')
    getExperts(): Promise<Expert[]> {
        return this.adminService.getExperts()
    }

    @Patch('expert')
    updateExpertStatus(@Body() expertData: Partial<Expert>) {
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
