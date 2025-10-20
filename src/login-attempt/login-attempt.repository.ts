import { PrismaService } from "src/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class LoginAttemptRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findSingle(where: any, orderBy: any) {
        return this.prisma.loginAttempt.findFirst({
            where,
            orderBy,
        });
    }

    async create(data: Prisma.LoginAttemptCreateInput) {
        return this.prisma.loginAttempt.create({
            data,
        });
    }
}