import { PrismaService } from "src/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getCategories(
        where?: any,
        limit?: number,
        offset?: number,
        include?: any
    ) {
        return this.prisma.category.findMany({
            where,
            take: limit,
            skip: offset,
            include: {
                ...include,
            },
        });
    }

}