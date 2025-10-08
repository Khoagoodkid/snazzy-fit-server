import { Module } from "@nestjs/common";
import { VariantController } from "./variant.controller";
import { VariantService } from "./variant.service";
import { VariantRepository } from "./variant.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [VariantController],
    providers: [VariantService, VariantRepository],
    exports: [VariantService],
})
export class VariantModule { }