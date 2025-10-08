import { PrismaService } from "src/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CollectionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getCollections(
        where?: any,
        limit?: number,
        offset?: number,
        include?: any
    ) {
        return this.prisma.collection.findMany({
            where,
            take: limit,
            skip: offset,
            include: {
                ...include,
            },
        });
    }

}