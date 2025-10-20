import { PrismaService } from "src/common/prisma/prisma.service";
import { Prisma, TicketType  } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { TimeService } from "src/utils/time.service";
@Injectable()
export class TicketRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create({
        user_id,
        title,
        description,
        images,
        order_id,
        type,
        tags,
    }: {
        user_id: string;
        title: string;
        description: string;
        images: string[];
        order_id?: string;
        type?: TicketType;
        tags?: string[];
    }) {
        return this.prisma.ticket.create({
            data: {
                user_id,
                title,
                description,
                images,
                order_id,
                type,
                tags,
                created_at: TimeService.currentUnix(),
            }
        });
    }

    async update(id: string, data: Prisma.TicketUpdateInput) {
        return this.prisma.ticket.update({
            where: { id },
            data: {
                ...data,
                updated_at: TimeService.currentUnix(),
            }
        });
    }

    async delete(id: string) {
        return this.prisma.ticket.delete({
            where: { id }
        });
    }

    async findById(id: string) {
        return this.prisma.ticket.findUnique({
            where: { id },
            include: {
                user: true,
                order: {
                    include: {
                        items: true,
                    }
                }
            }
        });
    }

    async findAll(where: any) {
        return this.prisma.ticket.findMany({
            where,
            include: {
                user: true,
                order: true,
                sessions: true,
            }
        });
    }
}