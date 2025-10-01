import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Body } from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { CreatedResponse } from "src/core/successResponse";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    async register(@Body() user: CreateUserDto) {
        return new CreatedResponse({
            data: await this.authService.register(user),
            message: 'User registered successfully',
        })
    }
}