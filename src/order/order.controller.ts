import { Controller, Req, UseGuards, Body, Param, Get, Res } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import { GetResponse } from "src/core/successResponse";

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Req() req: FastifyRequest, @Body() body: CreateOrderDto) {

        const userId = (req as any).user.id;
        const stripeSession = await this.orderService.createOrder(userId, body);
        return { url: stripeSession.url, id: stripeSession.id };
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async getOrderDetails(@Param('id') id: string, @Res() reply: FastifyReply) {
        const data = await this.orderService.getOrderDetails(id);
        return reply.send(new GetResponse({
            data: data,
            message: 'Order details fetched successfully',
        }));
    }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async getOrders(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const data = await this.orderService.getOrdersByUserId(userId);
        return reply.send(new GetResponse({
            data: data,
            message: 'Orders fetched successfully',
        }));
    }
}