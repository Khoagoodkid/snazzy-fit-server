import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { CollectionService } from "./collection.service";
import { ApiQuery } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { GetResponse } from "src/core/successResponse";

@Controller('collections')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {

    }

    @Get('')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    async getCollections(
        @Res() reply: FastifyReply,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('keyword') keyword?: string,
    ) {
        const data = await this.collectionService.getCollections(limit, offset, keyword);
        return reply.send(new GetResponse({
            data: data,
            message: 'Collections fetched successfully',
            totalRecord: data.length,
        }));
    }

    @Get('/with-categories')
    async getCollectionsWithCategories(
        @Res() reply: FastifyReply,
    ) {
        const data = await this.collectionService.getCollectionsWithCategories();
        return reply.send(new GetResponse({
            data: data,
            message: 'Collections fetched successfully',
            totalRecord: data.length,
        }));
    }
}