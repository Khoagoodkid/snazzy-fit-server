import { Module } from "@nestjs/common";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { CollectionService } from "./collection.service";
import { CollectionRepository } from "./collection.repository";
import { CollectionController } from "./collection.controller";
import { CategoriesModule } from "src/categories/categories.module";
import { ProductModule } from "src/product/product.module";
import { RedisService } from "src/redis/redis.service";

@Module({
    imports: [PrismaModule, CategoriesModule, ProductModule],
    controllers: [CollectionController],
    providers: [CollectionService, CollectionRepository, RedisService],
    exports: [CollectionService],
})
export class CollectionModule { }
