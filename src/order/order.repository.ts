import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { TimeService } from "src/utils/time.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class OrderRepository {
    constructor(private readonly prisma: PrismaService) { }


    async create(userId: string,
        totalAmount: number,
        subTotal: number,
        shippingAmount: number,
        taxAmount: number,
        customerName: string,
        customerEmail: string,
        customerPhone: string,
        customerAddress: string,
        customerCity: string,
        customerState: string,
        customerZip: string,
        customerCountry: string,
        paymentMethod: string
    ) {
        return this.prisma.order.create({
            data: {
                user_id: userId,
                total_amount: totalAmount,
                sub_total: subTotal,
                shipping_amount: shippingAmount,
                tax_amount: taxAmount,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                customer_address: customerAddress,
                customer_city: customerCity,
                customer_state: customerState,
                customer_zip: customerZip,
                customer_country: customerCountry,
                payment_method: paymentMethod,
                created_at: TimeService.currentUnix(),
            },
        });
    }

    async update(where: any, data: Prisma.OrderUpdateInput) {
        return this.prisma.order.update({
            where,
            data,
        });
    }

    async findById(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                            },
                        }
                    },
                }
            },
        });
    }

    async findMany(where: any) {
        return this.prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                            },
                        }
                    },
                }
            },
        });
    }
}