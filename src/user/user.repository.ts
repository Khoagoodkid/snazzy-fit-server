
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/common/prisma/prisma.service";
import { TimeService } from "src/utils/time.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }

    async create(user: CreateUserDto, verify_token: string) {
        return this.prisma.user.create({
            data: {
                name: user.username,
                email: user.email,
                password: user.password,
                created_at: TimeService.currentUnix(),
                verify_token,
            },
        });
    }


    async update(where: any, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where,
            data
        });
    }

    async createGoogleUser(email: string, name: string, avatar: string, google_id: string) {
        return this.prisma.user.create({
            data: {
                email,
                name,
                avatar,
                google_id,
                created_at: TimeService.currentUnix(),
                provider: 'google',
                is_verified: 1,
            },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    async findUser(where: Prisma.UserWhereInput) {
        return this.prisma.user.findFirst({
            where
        });
    }
}