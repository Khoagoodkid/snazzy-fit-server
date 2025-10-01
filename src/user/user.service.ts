
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { BusinessLogicError } from "src/core/base.error";
import { PasswordService } from "src/utils/password.service";
import { HashService } from "src/utils/hash.service";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly passwordService: PasswordService, private readonly hashService: HashService) { }

    async findUserByEmail(email: string) {
        return this.userRepository.findUserByEmail(email);
    }

    async createUser(user: CreateUserDto) {
        const existingUser = await this.userRepository.findUserByEmail(user.email);
        if (existingUser) {
            throw new BusinessLogicError("User already exists");
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
            return this.userRepository.create(userData, verify_token);
        } catch (error) {
            throw new BusinessLogicError("Failed to create user");
        }
    }
}