import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";

@Injectable()

export class AddressRepository {

    constructor(private readonly prisma: PrismaService) { }

    async create(
        {
            customerFirstName,
            customerLastName,
            address,
            city,
            state,
            zip,
            country,
            phone,
            userId,
            companyName,
        }: {
            customerFirstName: string;
            customerLastName: string;
            address: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            phone: string;
            userId: string;
            companyName?: string;
        }
    ) {
        return this.prisma.address.create({
            data: {
                customer_first_name: customerFirstName,
                customer_last_name: customerLastName,
                company_name: companyName,
                address: address,
                city: city,
                state: state,
                zip: zip,
                country: country,
                phone: phone,
                user_id: userId,
            },
        });
    }


    async get(where: any) {
        return this.prisma.address.findMany({
            where,
        });
    }

    async update(where: any, data: any) {
        return this.prisma.address.update({
            where,
            data,
        });
    }

    async delete(where: any) {
        return this.prisma.address.delete({
            where,
        });
    }

}