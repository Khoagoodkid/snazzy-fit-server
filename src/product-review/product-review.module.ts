import { Module } from "@nestjs/common";
import { ProductReviewController } from "./product-review.controller";
import { ProductReviewService } from "./product-review.service";
import { ProductReviewRepository } from "./product-review.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { UploadModule } from "src/upload/upload.module";

@Module({
    imports: [PrismaModule, UploadModule],
    controllers: [ProductReviewController],
    providers: [ProductReviewService, ProductReviewRepository],
})  

export class ProductReviewModule { }