import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { GoogleStrategy } from 'src/common/strategy/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { UsersService } from 'src/users/users.service';
import { LinkedInStrategy } from 'src/common/strategy/linkedin.strategy';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    UsersModule,
    StripeModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    PassportModule.register({ defaultStrategy: 'linkedin' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      })
    }),
    ConfigModule,
    EmailModule
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, LinkedInStrategy, UsersService],
  controllers: [AuthController]
})
export class AuthModule { }
