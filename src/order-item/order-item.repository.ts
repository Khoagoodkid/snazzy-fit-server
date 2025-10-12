import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { Injectable } from "@nestjs/common";
@Injectable()
export class OrderItemRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createMany(items: {
        cart_id: string | null;
        order_id: string;
        variant_id: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }[]) {
        return this.prisma.orderItem.createMany({
            data: items.map(item => ({
                cart_id: item.cart_id,
                order_id: item.order_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
            })),
        });
    }
}