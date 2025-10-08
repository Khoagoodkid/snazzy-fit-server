import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { TimeService } from "src/utils/time.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class CartRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(userId: string) {
        return this.prisma.cart.findMany({
            where: { user_id: userId },
            include: {
                variant: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async addToCart(userId: string, variantId: string, quantity: number) {
        return this.prisma.cart.create({
            data: { user_id: userId, variant_id: variantId, quantity,
                created_at: TimeService.currentUnix(),
            },
        });
    }

    async deleteById(id: string) {
        return this.prisma.cart.delete({
            where: { id },
        });
    }

    async updateCart(where: Prisma.CartWhereUniqueInput, data: Prisma.CartUpdateInput) {
        return this.prisma.cart.update({
            where,
            data,
        });
    }
}