import { PrismaService } from "src/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getProducts(
        where: any,
        limit?: number,
        offset?: number,
        include?: any
    ) {
        return this.prisma.product.findMany({
            where,
            take: limit,
            skip: offset,
            include: {
                ...include,
            },
        });
    }

    async findByCollectionIdAndCategoryId(collection_id?: string, category_id?: string) {
        return this.prisma.product.findMany({
            where: {
                ...(collection_id && { collection_id: collection_id }),
                ...(category_id && { category_id: category_id }),
            },
        });
    }

    async findById(id: string) {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }

}