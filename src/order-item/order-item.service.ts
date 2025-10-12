import { OrderItemRepository } from "./order-item.repository";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { BusinessLogicError } from "src/core/base.error";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderItemService {
    constructor(private readonly orderItemRepository: OrderItemRepository) { }

    async createManyOrderItems(createOrderItemDto: CreateOrderItemDto[]) {
        try {

            const items = createOrderItemDto.map(item => ({
                cart_id: item.cart_id,
                order_id: item.order_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
            }));
            return this.orderItemRepository.createMany(items);
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError("Failed to create order item");
        }
    }
}