import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.RoleCreateInput) {
        return this.prisma.role.create({
            data,
        });
    }

    async findAll(where?: Prisma.RoleWhereInput, limit?: number, offset?: number) {
        return this.prisma.role.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async findById(id: string) {
        return this.prisma.role.findUnique({
            where: { id },

        });
    }

    async findByName(name: string) {
        return this.prisma.role.findUnique({
            where: { name },
        });
    }

    async update(id: string, data: Prisma.RoleUpdateInput) {
        return this.prisma.role.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.role.delete({
            where: { id },
        });
    }

    async count(where?: Prisma.RoleWhereInput) {
        return this.prisma.role.count({ where });
    }


}

