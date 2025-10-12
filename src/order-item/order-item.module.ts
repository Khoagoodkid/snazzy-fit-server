import { Module } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { OrderItemRepository } from "./order-item.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [],
    providers: [OrderItemService, OrderItemRepository],
    exports: [OrderItemService],
})
export class OrderItemModule { }