import { Body, Controller, Get, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
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
    async enterAdmin(@Body() adminData: Partial<Admin>) {
        const admin = await this.adminService.validateAdmin(adminData);
        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.adminService.loginAdmin(adminData)
    }

    @Post('logout')
    async exitAdmin(@Body() email: string) {
        return this.adminService.logoutAdmin(email);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async checkUserOnline(@Request() req) {
        return req.user;
    }

    @Get('users')
    viewUsers(): Promise<User[]> {
        return this.adminService.viewUsers()
    }

    @Put('users')
    updateUser(@Body() userData: Partial<User>): Promise<Partial<User>> {
        return this.adminService.updateUser(userData)
    }

    @Get('experts')
    viewExperts(): Promise<Expert[]> {
        return this.adminService.viewExperts()
    }

    @Put('experts')
    updateExpert(@Body() expertData: Partial<Expert>): Promise<Expert> {
        return this.adminService.updateExpert(expertData)
    }

    @Post('experts')
    addExpert(@Body() expert: {}) {
        return this.adminService.addExpert()
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
