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
import { FastifyReply, FastifyRequest } from "fastify";
import { SanitizeDataService } from "src/utils/sanitize-data.service";
import * as jwt from 'jsonwebtoken';
import { GoogleService } from "src/google/google.service";
import { User } from "@prisma/client";
import { SendMailService } from "src/send-mail/send-mail.service";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly userTokensService: UserTokensService,
        private readonly configService: ConfigService,
        private readonly sanitizeDataService: SanitizeDataService,
        private readonly googleService: GoogleService,
        private readonly sendMailService: SendMailService,
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
            throw new BusinessLogicError("User not found", 401);
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
            sameSite: 'none',
            path: '/',
            // secure: true,
            maxAge: accessToken.expiresAt,
        });

        reply.setCookie('refresh_token', refreshToken.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            // secure: true,
            maxAge: refreshToken.expiresAt,
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
            const verifyLink = this.configService.get<string>('CLIENT_BASE_URL') + "/verify-email?verify_token=" + verify_token;
            await this.sendMailService.sendWelcomeMail([user.email], user.username, verifyLink);
            console.log("Email sent successfully");

            return this.userService.createUser(userData, verify_token);
        } catch (error) {
            throw new BusinessLogicError("Failed to create user");
        }
    }

    async logout(req: FastifyRequest, reply: FastifyReply) {
        const access_token = req.cookies.access_token;
        const refresh_token = req.cookies.refresh_token;

        if (!access_token || !refresh_token) {
            throw new BusinessLogicError("Token not found");
        }
        try {
            reply.clearCookie("access_token");
            reply.clearCookie("refresh_token");

            return {};
        } catch (error) {
            throw new BusinessLogicError("Failed to log out");
        }
    }

    async refreshToken(refreshToken: string | undefined, reply: FastifyReply) {
        const refreshTokenSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET') || "secret";
        if (!refreshToken) {
            throw new BusinessLogicError("Refresh token not found");
        }

        let decode;
        try {
            decode = jwt.verify(refreshToken, refreshTokenSecret);
        } catch (error) {
            throw new BusinessLogicError("Invalid refresh token");
        }

        const user = await this.userService.findUserByEmail(decode.email);
        if (!user) {
            throw new BusinessLogicError("User not found");
        }

        if (Number(decode.expires_at) < TimeService.currentUnix()) {
            throw new BusinessLogicError("Refresh token expired");
        }

        const accessSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET') || "secret";
        const accessExpiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || "15m";

        const accessToken = await this.generateToken(user, accessSecret, accessExpiresIn, 'accessToken');
        reply.setCookie('access_token', accessToken.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: accessToken.expiresAt,
        });

        return {};

    }

    async handleGoogleCallback(code: string, reply: FastifyReply) {
        if (!code) {
            throw new Error('Authorization code is required');
        }

        try {
            const tokens = await this.googleService.getTokens(code);
            console.log("Tokens received:", tokens);

            const userInfo = await this.googleService.getUserInfo(tokens);



            const user = await this.userService.findUserByEmail(userInfo.data.email as string);

            let userData: User;

            if (!user) {
                userData = await this.userService.createGoogleUser(userInfo.data.email as string, userInfo.data.name as string, userInfo.data.picture as string, userInfo.data.id as string);

            } else {
                userData = user;
            }

            const accessSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET') || "secret";
            const refreshSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET') || "secret";
            const accessExpiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || "15m";
            const refreshExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || "7d";

            const accessToken = await this.generateToken(userData, accessSecret, accessExpiresIn, 'accessToken');
            const refreshToken = await this.generateToken(userData, refreshSecret, refreshExpiresIn, 'refreshToken');

            reply.setCookie('access_token', accessToken.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: accessToken.expiresAt,
            });

            reply.setCookie('refresh_token', refreshToken.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: refreshToken.expiresAt,
            });

            if (tokens.refresh_token) {
                reply.setCookie('google_refresh_token', tokens.refresh_token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: tokens.expiry_date ? tokens.expiry_date - Date.now() : 3600000,
                    sameSite: 'none',
                    path: '/',
                });
            }
            return {
                data: userData,
                url: this.configService.get<string>('CLIENT_BASE_URL') + "/oauth/google-callback"
            };
        } catch (error) {
            console.error("Error getting tokens:", error);
            throw new Error('Failed to exchange authorization code for tokens');
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.userService.findUserById(id);
            if (!user) {
                throw new BusinessLogicError("User not found");
            }
            return SanitizeDataService.sanitizeUser(user);
        } catch (error) {
            throw new BusinessLogicError("Failed to get user");
        }
    }

    async verifyEmail(verify_token: string) {
        const user = await this.userService.findUser({ verify_token });
        if (!user) {
            throw new BusinessLogicError("User not found");
        }

        if (user.is_verified === 1) {
            throw new BusinessLogicError("Email already verified");
        }

        if (user.verify_token !== verify_token) {
            throw new BusinessLogicError("Invalid verify token");
        }

        await this.userService.updateUser({ id: user.id }, { is_verified: 1, verify_token: null });

        return user;
    }

    async changePasswordRequest(email: string) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new BusinessLogicError("User not found");
        }

        const changePasswordToken = await this.hashService.generateVerfiyToken();
        await this.userService.updateUser({ id: user.id }, { change_password_token: changePasswordToken });
        const changePasswordLink = this.configService.get<string>('CLIENT_BASE_URL') + "/reset-password?token=" + changePasswordToken;
        await this.sendMailService.sendChangePasswordMail([email], user.name, changePasswordLink);
        return user;
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const user = await this.userService.findUser({ change_password_token: changePasswordDto.token });
        if (!user) {
            throw new BusinessLogicError("Invalid token");
        }

        const isSameWithOldPassword = await bcrypt.compare(changePasswordDto.password, user.password);
        if (isSameWithOldPassword) {
            throw new BusinessLogicError("New password cannot be the same as the old password");
        }

        const hashedPassword = await this.passwordService.hashPassword(changePasswordDto.password);

        await this.userService.updateUser({ id: user.id }, { password: hashedPassword, change_password_token: null });

        return user;
    }
}