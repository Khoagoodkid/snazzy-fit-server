import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Body } from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { CreatedResponse } from "src/core/successResponse";
import { LoginDto } from "./dto/login.dto";
import { FastifyReply } from "fastify";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, reply: FastifyReply) {
        return reply.send(new CreatedResponse({
            data: await this.authService.login(loginDto, reply),
            message: 'User logged in successfully',
        }));
    }


    @Post('register')
    async register(@Body() user: CreateUserDto, reply: FastifyReply) {
        return reply.send(new CreatedResponse({
            data: await this.authService.register(user),
            message: 'User registered successfully',
        }));
    }
}