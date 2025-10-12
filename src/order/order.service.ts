import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { BusinessLogicError } from "src/core/base.error";
import { OrderItemService } from "src/order-item/order-item.service";
import { StripeService } from "src/stripe/stripe.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemService: OrderItemService,
        @Inject(forwardRef(() => StripeService))
        private readonly stripeService: StripeService
    ) { }

    async createOrder(userId: string, createOrderDto: CreateOrderDto) {

        try {
            const order = await this.orderRepository.create(
                userId,
                createOrderDto.total_amount,
                createOrderDto.sub_total,
                createOrderDto.shipping_amount,
                createOrderDto.tax_amount,
                createOrderDto.customer_name,
                createOrderDto.customer_email,
                createOrderDto.customer_phone,
                createOrderDto.customer_address,
                createOrderDto.customer_city,
                createOrderDto.customer_state,
                createOrderDto.customer_zip,
                createOrderDto.customer_country,
                createOrderDto.payment_method
            );

            const itemsToAdd = createOrderDto.items.map(item => ({
                ...item,
                order_id: order.id,
            }));

            const oderItems = await this.orderItemService.createManyOrderItems(itemsToAdd);

            // Create Stripe checkout session
            const stripeSession = await this.stripeService.createCheckoutSession({
                orderId: order.id,
                amount: createOrderDto.total_amount,
                currency: 'USD',
            }, userId);


            return stripeSession;
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError("Failed to create order");
        }
    }

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        try {
            return this.orderRepository.update({ id: orderId }, { status });
        } catch (error) {
            throw new BusinessLogicError("Failed to update order status");
        }
    }

    async getOrderDetails(orderId: string) {
        try {
            return this.orderRepository.findById(orderId);
        } catch (error) {
            throw new BusinessLogicError("Failed to get order details");
        }
    }

    async getOrdersByUserId(userId: string) {
        try {
            return this.orderRepository.findMany({
                user_id: userId,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to get orders");
        }
    }
}