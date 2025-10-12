import { Controller, Post, Req, UseGuards, Body, Res, UseInterceptors, Get, Param, Delete, Patch } from "@nestjs/common";
import { ProductReviewService } from "./product-review.service";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { CreatedResponse, DeletedResponse, GetResponse, UpdatedResponse } from "src/core/successResponse";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ParseMultipartFormInterceptor } from "src/interceptors/parse-formdata";
import { UpdateProductReviewDto } from "./dto/update-product-review.dto";


@Controller('product-reviews')
export class ProductReviewController {
    constructor(private readonly productReviewService: ProductReviewService) { }

    @Post('')
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateProductReviewDto })
    @UseInterceptors(ParseMultipartFormInterceptor)
    async createProductReview(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const body = req.body as CreateProductReviewDto;
        const productReview = await this.productReviewService.create(body, userId);
        return reply.send(new CreatedResponse({
            data: productReview,
            message: 'Product review created successfully',
        }));
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async getProductReviews(@Param('id') id: string, @Res() reply: FastifyReply) {
        const productReview = await this.productReviewService.getReviewsByProductId(id);
        return reply.send(new GetResponse({
            data: productReview,
            message: 'Product reviews fetched successfully',
        }));
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async deleteProductReview(@Param('id') id: string, @Res() reply: FastifyReply) {
        const productReview = await this.productReviewService.deleteReview(id);
        return reply.send(new DeletedResponse({
            message: 'Product review deleted successfully',
            data: productReview,
        }));
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateProductReviewDto })
    @UseInterceptors(ParseMultipartFormInterceptor)
    async updateProductReview(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const updateProductReviewDto = req.body as UpdateProductReviewDto;
        const productReview = await this.productReviewService.updateReview(id, updateProductReviewDto, userId);
        return reply.send(new UpdatedResponse({
            data: productReview,
            message: 'Product review updated successfully',
        }));
    }
}