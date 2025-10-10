import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiParam, ApiQuery } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { GetResponse } from "src/core/successResponse";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {

    }

    @Get('')
    @ApiQuery({ name: 'category_id', required: false })
    @ApiQuery({ name: 'collection_id', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    @ApiQuery({ name: 'styles', required: false })
    @ApiQuery({ name: 'price_from', required: false }) 
    @ApiQuery({ name: 'price_to', required: false }) 
    @ApiQuery({ name: 'seasons', required: false })
    @ApiQuery({ name: 'sort_by', required: false })
    @ApiQuery({ name: 'sort_order', required: false })
    async getProducts(
        @Res() reply: FastifyReply,
        @Query('category_id') category_id?: string,
        @Query('collection_id') collection_id?: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('keyword') keyword?: string,
        @Query('styles') styles?: string,
        @Query('price_from') priceFrom?: number,
        @Query('price_to') priceTo?: number,
        @Query('seasons') seasons?: string,
        @Query('sort_by') sortBy?: string,
        @Query('sort_order') sortOrder?: string,
    ) {
        const data = await this.productService.getProducts({ category_id, collection_id, limit, offset, keyword, styles, priceFrom, priceTo, seasons, sortBy, sortOrder });
        return reply.send(new GetResponse({
            data: data,
            message: 'Products fetched successfully',
            totalRecord: data.products.length,
        }));
    }

    @Get(':slug')
    @ApiParam({ name: 'slug', required: true })
    async getProductDetail(
        @Res() reply: FastifyReply,
        @Param('slug') slug: string,
    ) {
        const data = await this.productService.getBySlug(slug);
        return reply.send(new GetResponse({
            data: data,
            message: 'Product detail fetched successfully',
        }));
    }
}