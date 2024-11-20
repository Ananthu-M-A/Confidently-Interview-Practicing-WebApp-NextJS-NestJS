import { Body, Controller, Post } from '@nestjs/common';
import { User, UserDocument } from 'src/users/users.schema';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async createUser(@Body() userData: User) {
        return this.authService.registerUser(userData);
    }

    @Post('login')
    async enterUser(@Body() userData: Partial<User>) {
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

}
