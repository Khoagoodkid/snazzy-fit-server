import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceRepository } from "./device.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";


@Module({
    imports: [PrismaModule],
    providers: [DeviceService, DeviceRepository],
    exports: [DeviceService],
})
export class DeviceModule { }