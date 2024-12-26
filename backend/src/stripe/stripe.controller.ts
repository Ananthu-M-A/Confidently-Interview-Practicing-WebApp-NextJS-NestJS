import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('api/stripe')
export class StripeController {
    constructor(private stripeService: StripeService) { }

    @Get('subscription/:userId')
    async subscribe(
        @Param('userId') userId: string) {
        return this.stripeService.subscribe(userId);
    }

    @Get('success')
    async successPayment(@Query('sessionId') sessionId: string) {        
        return this.stripeService.successPayment(sessionId);
    }

    @Get('cancel')
    async cancelPayment() {
        return "Payment cancelled";
    }
}
