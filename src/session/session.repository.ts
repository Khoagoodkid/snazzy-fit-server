import { PrismaService } from "src/common/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.SessionCreateInput) {
        return this.prisma.session.create({
            data,
        });
    }

    async findAll(where: Prisma.SessionWhereInput) {
        return this.prisma.session.findMany({
            where,
            include: {
                ticket: true,
                user: true,
                assistant: true,
                messages: {
                    take: 1,
                    orderBy: {
                        created_at: 'desc',
                    },
                }
            },
        });
    }

    async findMany(where: Prisma.SessionWhereInput) {
        return this.prisma.session.findMany({
            where,
            include: {
                ticket: true,
                user: true,
                assistant: true,
                messages: {
                    take: 1,
                    orderBy: {
                        created_at: 'desc',
                    },
                }
            },
        });
    }

    async findOne(where: Prisma.SessionWhereInput) {
        return this.prisma.session.findFirst({
            where,
        });
    }

    async findById(id: string) {
        return this.prisma.session.findUnique({
            where: { id },
            include: {
                ticket: true,
                user: true,
            },
        });
    }
    async update(where: Prisma.SessionWhereUniqueInput, data: Prisma.SessionUpdateInput) {
        return this.prisma.session.update({
            where,
            data,
        });
    }
}