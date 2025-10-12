import { Controller, Post, Res, Body, UseGuards, Req, Get, Param, Patch, Delete } from "@nestjs/common";
import { AddressService } from "./address.service";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateAddressDto } from "./dto/create-address.dto";
import { CreatedResponse, DeletedResponse, GetResponse, UpdatedResponse } from "src/core/successResponse";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Controller('addresses')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async createAddress(@Req() req: FastifyRequest, @Res() reply: FastifyReply, @Body() createAddressDto: CreateAddressDto) {
        const userId = (req as any).user.id;
        const data = await this.addressService.createAddress(createAddressDto, userId);
        return reply.send(new CreatedResponse({
            data: data,
            message: 'Address created successfully',
        }));
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getAddresses(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const data = await this.addressService.getAddressesByUserId(userId);
        return reply.send(new GetResponse({
            data: data,
            message: 'Addresses fetched successfully',
        }));
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateAddress(@Param('id') id: string, @Req() req: FastifyRequest, @Res() reply: FastifyReply, @Body() updateAddressDto: UpdateAddressDto) {
        const userId = (req as any).user.id;
        const data = await this.addressService.updateAddress(id, updateAddressDto, userId);
        return reply.send(new UpdatedResponse({
            data: data,
            message: 'Address updated successfully',
        }));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteAddress(@Param('id') id: string, @Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const data = await this.addressService.deleteAddress(id, userId);
        return reply.send(new DeletedResponse({
            data: data,
            message: 'Address deleted successfully',
        }));
    }
}