import { Controller, Post, Body, Res, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { CreatedResponse, GetResponse } from "src/core/successResponse";
import { LoginDto } from "./dto/login.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import { Get, Redirect, Query } from "@nestjs/common";
import { GoogleService } from "src/google/google.service";
import { JwtAuthGuard } from "./guards/auth.guard";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { ChangePasswordRequestDto } from "./dto/change-password-request.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly googleService: GoogleService) {
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() reply: FastifyReply) {
        const data = await this.authService.login(loginDto, reply);
        console.log(loginDto);
        return reply.send(new CreatedResponse({
            data: data,
            message: 'User logged in successfully',
        }));
    }


    @Post('register')
    async register(@Body() user: CreateUserDto, @Res() reply: FastifyReply) {
        return reply.send(new CreatedResponse({
            data: await this.authService.register(user),
            message: 'User registered successfully',
        }));
    }

    @Post("logout")
    async logout(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const data = await this.authService.logout(req, reply);
        return reply.send(new CreatedResponse({
            data: data,
            message: "Log out successfully"
        }))
    }

    @Post("refresh-token")
    async refreshToken(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const refreshToken = req.cookies.refresh_token;

        const data = await this.authService.refreshToken(refreshToken, reply);
        return reply.send(new CreatedResponse({
            data: data,
            message: "Refresh token successfully"
        }))
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const data = await this.authService.getUserById(userId);
        return reply.send(new GetResponse({
            data: data,
            message: "Get user data successfully"
        }))
    }

    @Get('google')
    @Redirect()
    redirectToGoogle(@Res() reply: FastifyReply) {
        const url = this.googleService.generateAuthUrl();


        return { url: url };

    }

    @Get('google/callback')
    @Redirect()
    async handleCallback(@Query('code') code: string, @Res() reply: FastifyReply) {
        const data = await this.authService.handleGoogleCallback(code, reply);
        return data;
    }

    @Post('verify-email')
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @Res() reply: FastifyReply) {
        const data = await this.authService.verifyEmail(verifyEmailDto.verify_token);
        return reply.send(new CreatedResponse({
            data: data,
            message: "Email verified successfully"
        }))
    }

    @Post('change-password-request')
    async changePasswordRequest(@Body() changePasswordRequestDto: ChangePasswordRequestDto, @Res() reply: FastifyReply) {
        const data = await this.authService.changePasswordRequest(changePasswordRequestDto.email);
        return reply.send(new CreatedResponse({
            data: data,
            message: "Change password request sent successfully"
        }))
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ChangePasswordDto, @Res() reply: FastifyReply) {
        const data = await this.authService.changePassword(resetPasswordDto);
        return reply.send(new CreatedResponse({
            data: data,
            message: "Password reset successfully"
        }))
    }


}