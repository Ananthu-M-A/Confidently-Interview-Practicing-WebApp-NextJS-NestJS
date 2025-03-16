import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
            clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
            callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL'),
            scope: ['openid', 'profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const { id, emails, displayName, photos } = profile;
        const user = {
            linkedinId: id,
            email: emails[0].value,
            name: displayName,
            photo: photos[0]?.value,
        };
        done(null, user);
    }
}
