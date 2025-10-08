import { PrismaService } from "src/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VariantRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string) {
        return this.prisma.variant.findUnique({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.variant.findMany({
            include: {
                product: true,
            },
        });
    }
}