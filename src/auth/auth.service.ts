import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { BusinessLogicError } from "src/core/base.error";
import { PasswordService } from "src/utils/password.service";
import { HashService } from "src/utils/hash.service";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { TimeService } from "src/utils/time.service";
import { UserTokensService } from "src/user-tokens/user-tokens.service";
import { ConfigService } from "@nestjs/config";
import { FastifyReply } from "fastify";
import { SanitizeDataService } from "src/utils/sanitize-data.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly userTokensService: UserTokensService,
        private readonly configService: ConfigService,
        private readonly sanitizeDataService: SanitizeDataService
    ) { }

    private async generateToken(user: any, secret: string, expiresIn: string, type: string) {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        }

        const token = this.jwtService.sign(payload, { secret, expiresIn });
        const expiresAt = TimeService.calculateExpiration(expiresIn);

        await this.userTokensService.insertToken(user.id, token, expiresAt, type);
        return { token, expiresAt };
    }

    async login(loginDto: LoginDto, reply: FastifyReply) {
        // return this.userService.login(email, password);
        const user = await this.userService.findUserByEmail(loginDto.email);
        if (!user) {
            throw new BusinessLogicError("User not found");
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new BusinessLogicError("Wrong password or email");
        }

        if (user.is_verified !== 1) {
            throw new BusinessLogicError("User not verified");
        }

        if (user.status !== 1) {
            throw new BusinessLogicError("User is blocked");
        }

        const accessSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET') || "secret";
        const refreshSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET') || "secret";
        const accessExpiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || "15m";
        const refreshExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || "7d";

        const accessToken = await this.generateToken(user, accessSecret, accessExpiresIn, 'accessToken');
        const refreshToken = await this.generateToken(user, refreshSecret, refreshExpiresIn, 'refreshToken');

        reply.setCookie('access_token', accessToken.token, {
            httpOnly: true,
            secure: true,
            maxAge: accessToken.expiresAt,
            sameSite: 'strict',
        });

        reply.setCookie('refresh_token', refreshToken.token, {
            httpOnly: true,
            secure: true,
            maxAge: refreshToken.expiresAt,
            sameSite: 'strict',
        });

        // remove sensitive fields
        const sanitizedUser = SanitizeDataService.sanitizeUser(user);
        return sanitizedUser;


    }



    async register(user: CreateUserDto) {
        const existingUser = await this.userService.findUserByEmail(user.email);
        if (existingUser) {
            throw new BusinessLogicError("User already exists");
        }

        const isValidatePassword = this.passwordService.validatePassword(user.password);
        if (!isValidatePassword) {
            throw new BusinessLogicError("Password is not valid, you must use at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character");
        }

        const hashedPassword = await this.passwordService.hashPassword(user.password);
        const verify_token = await this.hashService.generateVerfiyToken();

        const userData = {
            ...user,
            password: hashedPassword,
            status: 1,
            is_verified: 0,
            verify_token,
        }

        try {
            return this.userService.createUser(userData, verify_token);
        } catch (error) {
            throw new BusinessLogicError("Failed to create user");
        }
    }
}