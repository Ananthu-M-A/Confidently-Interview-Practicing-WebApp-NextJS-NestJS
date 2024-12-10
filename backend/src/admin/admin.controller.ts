import { Body, Controller, Get, Patch, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LoginCredDTO } from 'src/common/dtos/login-cred.dto';
import { UserDTO } from 'src/common/dtos/user.dto';
import { ExpertDTO } from 'src/common/dtos/expert.dto';

@Controller('api/admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async authenticateAdmin(@Request() req) {
        if (!req.user) {
            throw new UnauthorizedException(`Admin not found!`)
        }
        return req.user;
    }

    @Post('login')
    async adminLogin(@Body() adminData: LoginCredDTO) {
        return this.adminService.adminLogin(adminData)
    }

    @Get('users')
    getUsers() {
        return this.adminService.getUsers()
    }

    @Patch('user')
    updateUserStatus(@Body() userData: UserDTO) {
        return this.adminService.updateUserStatus(userData)
    }

    @Get('experts')
    getExperts() {
        return this.adminService.getExperts()
    }

    @Patch('expert')
    updateExpertStatus(@Body() expertData: ExpertDTO) {
        return this.adminService.updateExpertStatus(expertData)
    }

    @Post('expert')
    addExpert(@Body() expertData: ExpertDTO) {
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
