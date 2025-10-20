import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createMany(data: Prisma.PermissionCreateManyInput[]) {
        return this.prisma.permission.createMany({
            data,
        });
    }

    async create(data: Prisma.PermissionCreateInput) {
        return this.prisma.permission.create({
            data,
        });
    }

    async findAll(where?: Prisma.PermissionWhereInput, limit?: number, offset?: number) {
        return this.prisma.permission.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async findById(id: string) {
        return this.prisma.permission.findUnique({
            where: { id },
        });
    }

    async findByName(name: string) {
        return this.prisma.permission.findUnique({
            where: { name },
        });
    }

    async update(id: string, data: Prisma.PermissionUpdateInput) {
        return this.prisma.permission.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.permission.delete({
            where: { id },
        });
    }

    async count(where?: Prisma.PermissionWhereInput) {
        return this.prisma.permission.count({ where });
    }
}

