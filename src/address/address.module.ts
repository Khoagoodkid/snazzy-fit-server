import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { AddressRepository } from "./address.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";


@Module({
    imports: [PrismaModule],
    controllers: [AddressController],
    providers: [AddressService, AddressRepository],
    exports: [AddressService],
})
export class AddressModule { }