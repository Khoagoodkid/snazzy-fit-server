import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ApiQuery } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { GetResponse } from "src/core/successResponse";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {

    }

    @Get('')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    async getCategories(
        @Res() reply: FastifyReply,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('keyword') keyword?: string,
    ) {
        const data = await this.categoriesService.getCategories(limit, offset, keyword);
        return reply.send(new GetResponse({
            data: data,
            message: 'Categories fetched successfully',
            totalRecord: data.length,
        }));
    }
}