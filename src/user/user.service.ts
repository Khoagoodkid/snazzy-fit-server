
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { BusinessLogicError } from "src/core/base.error";
import { PasswordService } from "src/utils/password.service";
import { HashService } from "src/utils/hash.service";
import { Prisma } from "@prisma/client";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import * as bcrypt from "bcrypt";
import { SanitizeDataService } from "src/utils/sanitize-data.service";
import { UploadService } from "src/upload/upload.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly hashService: HashService,
        private readonly uploadService: UploadService
    ) { }



    async findUserByEmail(email: string) {
        try {
            return this.userRepository.findUserByEmail(email);
        } catch (error) {
            throw new BusinessLogicError("Failed to find user");
        }
    }

    async findUserById(id: string) {
        try {
            return this.userRepository.findById(id);
        } catch (error) {
            throw new BusinessLogicError("Failed to find user");
        }
    }

    async findUser(where: Prisma.UserWhereInput) {

        try {
            return this.userRepository.findUser(where);
        } catch (error) {
            throw new BusinessLogicError("Failed to find user");
        }
    }
    async updateUser(where: Prisma.UserWhereInput, data: Prisma.UserUpdateInput) {
        try {
            return this.userRepository.update(where, data);
        } catch (error) {
            throw new BusinessLogicError("Failed to update user");
        }
    }

    async updateProfile(userId: string, data: UpdateUserDto) {
        try {
            // ParseMultipartFormInterceptor converts files to an array of objects with buffer property
            const avatarFiles = data.file as any[];

            let url: string | null = null;
            if (avatarFiles && avatarFiles.length > 0) {
                const avatarFile = avatarFiles[0]; // Get the first file
                url = await this.uploadService.uploadImage(
                    avatarFile,
                    userId + "/" + avatarFile.filename,
                    'avatars'
                );
            }

            const { file, ...rest } = data;

            const updatedUser = await this.userRepository.update({
                id: userId
            }, {
                ...rest,
                avatar: url
            });
            const sanitizedUser = SanitizeDataService.sanitizeUser(updatedUser);
            return sanitizedUser;
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError("Failed to update user");
        }
    }

    async createUser(user: CreateUserDto, verify_token: string) {

        try {
            return this.userRepository.create(user, verify_token);
        } catch (error) {
            throw new BusinessLogicError("Failed to create user");
        }
    }

    async createGoogleUser(email: string, name: string, avatar: string, google_id: string) {
        try {
            return this.userRepository.createGoogleUser(email, name, avatar, google_id);
        } catch (error) {
            throw new BusinessLogicError("Failed to create user");
        }
    }

    async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
        try {

            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new BusinessLogicError("User not found");
            }

            const isSameWithOldPassword = await bcrypt.compare(updatePasswordDto.old_password, user.password);
            if (isSameWithOldPassword) {
                throw new BusinessLogicError("Wrong old password");
            }

            const hashedPassword = await this.passwordService.hashPassword(updatePasswordDto.new_password);

            const updatedUser = await this.userRepository.update({
                id: userId
            }, {
                password: hashedPassword
            });
            const sanitizedUser = SanitizeDataService.sanitizeUser(updatedUser);
            return sanitizedUser;
        } catch (error) {
            throw new BusinessLogicError("Failed to update password");
        }
    }
}