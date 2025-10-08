import { Controller, Get, Res } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { VariantService } from "./variant.service";
import { GetResponse } from "src/core/successResponse";

@Controller('variants')
export class VariantController {
    constructor(private readonly variantService: VariantService) { }

    @Get('')
    async getAll(
        @Res() reply: FastifyReply,
    ) {
        const data = await this.variantService.getAll();
        return reply.send(new GetResponse({
            data: data,
            message: 'Variants fetched successfully',
        }));
    }
}