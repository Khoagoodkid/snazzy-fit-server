
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { BusinessLogicError } from "src/core/base.error";
import { PasswordService } from "src/utils/password.service";
import { HashService } from "src/utils/hash.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly passwordService: PasswordService, private readonly hashService: HashService) { }

   

    async findUserByEmail(email: string) {
        return this.userRepository.findUserByEmail(email);
    }

    async findUserById(id: string) {
        return this.userRepository.findById(id);
    }

    async findUser(where: Prisma.UserWhereInput) {
        return this.userRepository.findUser(where);
    }

    async updateUser(where: Prisma.UserWhereInput, data: Prisma.UserUpdateInput) {
        return this.userRepository.update(where, data);
    }

    async createUser(user: CreateUserDto, verify_token: string) {
       
        try {
            return this.userRepository.create(user, verify_token);
        } catch (error) {
            throw new BusinessLogicError("Failed to create user");
        }
    }

    async createGoogleUser(email: string, name: string, avatar: string, google_id: string) {
        return this.userRepository.createGoogleUser(email, name, avatar, google_id);
    }
}