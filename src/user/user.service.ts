
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

    async createUser(user: CreateUserDto, verify_token: string) {
       
        try {
            return this.userRepository.create(user, verify_token);
        } catch (error) {
            throw new BusinessLogicError("Failed to create user");
        }
    }
}