// src/google/google.service.ts
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService {
    private oauth2Client: any;
    constructor(
        private readonly configService: ConfigService,
    ) {
        this.oauth2Client = new google.auth.OAuth2(
            this.configService.get('GOOGLE_CLIENT_ID'),
            this.configService.get('GOOGLE_CLIENT_SECRET'),
            this.configService.get('GOOGLE_REDIRECT_URI'),
        );
    }

    generateAuthUrl(): string {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
        });
    }

    async getUserInfo(tokens: any) {
        this.oauth2Client.setCredentials(tokens);

        const googleAuth = google.oauth2({
            version: 'v2',
            auth: this.oauth2Client,
        });

        const userInfo = await googleAuth.userinfo.get();
        return userInfo;
    }

    async getTokens(code: string) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        return tokens;
    }


   
}
