import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { ProductReview } from "@prisma/client";
import { TimeService } from "src/utils/time.service";

@Injectable()
export class ProductReviewRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create({
        product_id,
        user_id,
        variant_id,
        rating,
        comment,
        images,
    }: {
        product_id: string;
        user_id: string;
        variant_id?: string;
        rating: number;
        comment: string;
        images: string[];
    }): Promise<ProductReview> {
        return this.prisma.productReview.create({
            data: {
                product_id,
                user_id,
                variant_id,
                rating,
                comment,
                images,
                created_at: TimeService.currentUnix(),
            }
        });
    }

    async update(where: any, data: any) {

        return this.prisma.productReview.update({
            where,
            data,
        });
    }

    async delete(where: any) {
        return this.prisma.productReview.delete({
            where,
        });
    }

    async findById(id: string) {
        return this.prisma.productReview.findUnique({
            where: { id },
        });
    }

    async findAll(where: any) {
        return this.prisma.productReview.findMany({
            where,
            include: {
                user: true,
                variant: true,
                
            }
        });
    }
}