import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartRepository } from "./cart.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { VariantModule } from "src/variant/variant.module";
import { RolePermissionModule } from "src/role-permission/role-permission.module";
import { PermissionModule } from "src/permission/permission.module";
import { RoleModule } from "src/role/role.module";


@Module({
    imports: [PrismaModule, VariantModule, RolePermissionModule,
         PermissionModule,
         RoleModule,

    ],
    controllers: [CartController],
    providers: [CartService, CartRepository],
    exports: [CartService],
})
export class CartModule { }