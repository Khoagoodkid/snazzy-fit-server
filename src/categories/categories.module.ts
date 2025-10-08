import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesRepository } from "./categories.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { CategoriesController } from "./categories.controller";

@Module({
    imports: [PrismaModule],
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoriesRepository],
    exports: [CategoriesService],
})
export class CategoriesModule { }