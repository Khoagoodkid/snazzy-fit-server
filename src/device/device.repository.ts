import { PrismaService } from "src/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class DeviceRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findSingle(where: any) {
        return this.prisma.device.findFirst({
            where,
        });
    }
    
    async upsert(where: any, create: Prisma.DeviceCreateInput, update: Prisma.DeviceUpdateInput) {
        return this.prisma.device.upsert({
            where,
            update,
            create,
        });
    }
}