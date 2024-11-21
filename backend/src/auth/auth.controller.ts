import { Body, Controller, Get, Post, Req, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from 'src/common/schemas/users.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async createUser(@Body() userData: User) {
        return this.authService.registerUser(userData);
    }

    @Post('login')
    async enterUser(@Body() userData: Partial<User>) {
        const user = await this.authService.validateUser(userData);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.loginUser(userData);
    }

    @Post('logout')
    async exitUser(@Body() email: string) {
        return this.authService.logoutUser(email);
    }

    @Post('resetPassword')
    async resetUserEntry(@Body() email: string) {
        return this.authService.resetUser(email);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async checkUserOnline(@Request() req) {
        return req.user;
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) { }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Partial<any>) {
        const { firstName, lastName, email } = req.user;
        return this.authService.registerUser({
            fullname:`${firstName} ${lastName}`,
            email,
            password: process.env.CONFIDENTLY_DEFAULT_PASSWORD,
            subscription: false,
            active: true
        })
    }
}
