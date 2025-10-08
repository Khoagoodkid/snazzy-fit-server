import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProductRepository } from "./product.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { RedisService } from "src/redis/redis.service";
import { SerializeService } from "src/utils/serialize.service";

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository, RedisService, SerializeService],
    exports: [ProductService],
})

export class ProductModule { }

