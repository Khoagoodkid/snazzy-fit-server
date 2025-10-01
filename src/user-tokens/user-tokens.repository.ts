import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";


@Injectable()
export class UserTokensRepository {
    constructor(private readonly prisma: PrismaService) { }

    async insertToken(user_id: string, token: string, expires_at: number, type: string) {
        return this.prisma.token.create({
            data: {
                user_id,
                token,
                expires_at,
                type,
            },
        });
    }

    async findTokenByToken(token: string, user_id: string, type: string) {
        return this.prisma.token.findFirst({
            where: {
                token,
                user_id,
                type,
            },
        });
    }



}
