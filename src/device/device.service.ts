import { Injectable } from "@nestjs/common";
import { DeviceRepository } from "./device.repository";

@Injectable()   
export class DeviceService {
    constructor(private readonly deviceRepository: DeviceRepository) { }

    async findDevice({
        where,
    }) {
        return this.deviceRepository.findSingle(where);
    }

    async upsertDevice({
        where,
        create,
        update,
    }: {
        where: any;
        create: any;
        update: any;
    }) { 
        return this.deviceRepository.upsert(where, create, update);
    }
}
