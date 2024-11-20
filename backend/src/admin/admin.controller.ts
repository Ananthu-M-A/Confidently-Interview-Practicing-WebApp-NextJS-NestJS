import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { User } from 'src/common/schemas/users.schema';
import { AdminService } from './admin.service';
import { Admin } from '../common/schemas/admin.schema';

@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    @Post('login')
    loginAdmin(@Body() adminData: Partial<Admin>) {
        return this.adminService.loginAdmin(adminData)
    }

    @Get('users')
    viewUsers() {
        return this.adminService.viewUsers()
    }

    @Put('users')
    updateUser(@Body() user: {}) {
        return this.adminService.updateUser()
    }

    @Get('experts')
    viewExperts() {
        return this.adminService.viewExperts()
    }

    @Put('experts')
    updateExpert(@Body() expert: {}) {
        return this.adminService.updateExpert()
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
