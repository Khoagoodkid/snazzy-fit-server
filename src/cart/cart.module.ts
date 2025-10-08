import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartRepository } from "./cart.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { VariantModule } from "src/variant/variant.module";


@Module({
    imports: [PrismaModule, VariantModule],
    controllers: [CartController],
    providers: [CartService, CartRepository],
    exports: [CartService],
})
export class CartModule { }