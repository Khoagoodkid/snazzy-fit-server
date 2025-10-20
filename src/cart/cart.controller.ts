import { Controller, Get, Req, Res, UseGuards, Body, Post, Delete, Param, Patch } from "@nestjs/common";
import { CartService } from "./cart.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { CreatedResponse, DeletedResponse, GetResponse, UpdatedResponse } from "src/core/successResponse";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { Permission } from "src/auth/decorators/permission.decorators";
import { PermissionGuard } from "src/auth/guards/permission.guard";
import { PermissionStore } from "src/constants/permission.constants";


@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get('')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.GET_CART)
    async getCart(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const data = await this.cartService.getCart(userId);
        return reply.send(new GetResponse({
            data: data,
            message: 'Cart fetched successfully',
            totalRecord: data.length,
        }));
    }

    @Post('add-to-cart')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.ADD_TO_CART)
    async addToCart(@Req() req: FastifyRequest, @Res() reply: FastifyReply, @Body() createCartDto: CreateCartDto) {
        const userId = (req as any).user.id;
        console.log("1", userId);
        const data = await this.cartService.addToCart(userId, createCartDto);
        return reply.send(new CreatedResponse({
            data: data,
            message: 'Cart added successfully',
        }));
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.REMOVE_FROM_CART)
    async removeFromCart(@Req() req: FastifyRequest, @Res() reply: FastifyReply, @Param('id') id: string) {
        const data = await this.cartService.removeCart(id);
        return reply.send(new DeletedResponse({
            data: data,
            message: 'Cart removed successfully',
        }));
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.UPDATE_CART)
    async updateCart(@Req() req: FastifyRequest, @Res() reply: FastifyReply, @Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
        const data = await this.cartService.updateCart(id, updateCartDto);
        return reply.send(new UpdatedResponse({
            data: data,
            message: 'Cart updated successfully',
        }));
    }
}