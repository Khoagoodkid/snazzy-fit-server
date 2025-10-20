import { PrismaService } from "src/common/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RolePermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsert(where: Prisma.RolePermissionWhereUniqueInput, update: Prisma.RolePermissionUpdateInput, create: Prisma.RolePermissionCreateInput) {
        return this.prisma.rolePermission.upsert({
            where,
            update,
            create,
        });
    }

    async create(data: Prisma.RolePermissionCreateInput) {
        return this.prisma.rolePermission.create({
            data,
        });
    }

    async findAll(where?: Prisma.RolePermissionWhereInput, limit?: number, offset?: number) {
        return this.prisma.rolePermission.findMany({
            where,
            take: limit,
            skip: offset,
        });
    }

    async update(where: Prisma.RolePermissionWhereUniqueInput, data: Prisma.RolePermissionUpdateInput) {
        return this.prisma.rolePermission.update({
            where,
            data,
        });
    }
    
    async delete(id: string) {
        return this.prisma.rolePermission.delete({
            where: { id },
        });
    }

    async findById(id: string) {
        return this.prisma.rolePermission.findUnique({
            where: { id },
        });
    }


}
