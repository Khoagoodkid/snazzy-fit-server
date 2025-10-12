import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { OrderItemModule } from "src/order-item/order-item.module";
import { OrderController } from "./order.controller";
import { StripeService } from "src/stripe/stripe.service";
import { VariantModule } from "src/variant/variant.module";
import { CartModule } from "src/cart/cart.module";

@Module({
    imports: [PrismaModule, OrderItemModule, VariantModule, CartModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository, StripeService, ],
    exports: [OrderService, OrderRepository, StripeService],
})

export class OrderModule { }