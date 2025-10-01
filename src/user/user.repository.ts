
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/common/prisma/prisma.service";
import { TimeService } from "src/utils/time.service";

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
}