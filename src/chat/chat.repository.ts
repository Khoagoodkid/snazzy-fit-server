import { PrismaService } from "src/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class ChatRepository {   
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.message.create({
            data,
        });
    }
    
    async getMessages(sessionId: string, limit?: number, offset?: number, orderBy?: any) {
        return this.prisma.message.findMany({
            where: {
                session_id: sessionId,
            },
            take: limit,
            skip: offset,
            orderBy: orderBy,
        });
    }
    
}