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

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PassportModule.register({defaultStrategy:'google'}),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      })
    }),
    ConfigModule,
    EmailModule
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, UsersService],
  controllers: [AuthController]
})
export class AuthModule { }
