import { Injectable } from "@nestjs/common";
import { ProductReviewRepository } from "./product-review.repository";
import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { UploadService } from "src/upload/upload.service";
import { BusinessLogicError } from "src/core/base.error";
import { UpdateProductReviewDto } from "./dto/update-product-review.dto";

@Injectable()
export class ProductReviewService {
    constructor(private readonly productReviewRepository: ProductReviewRepository, private readonly uploadService: UploadService) { }


    async create(createProductReviewDto: CreateProductReviewDto, userId: string) {

        try {
            const path = "product-" + createProductReviewDto.product_id + "/" + "userId-" + userId;
            let images: string[] | null = null;
            if (createProductReviewDto.files && createProductReviewDto.files.length > 0) {
                images = await Promise.all(createProductReviewDto.files?.map(async (file) => {
                    const image = await this.uploadService.uploadImage(
                        file,
                        path + "/" + file.filename,
                        'product-reviews'
                    );
                    return image;
                }));
            }
            const payload = {
                product_id: createProductReviewDto.product_id,
                user_id: userId,
                variant_id: createProductReviewDto.variant_id || undefined,
                rating: createProductReviewDto.rating,
                comment: createProductReviewDto.comment,
                images: images ?? [],
            }

            return this.productReviewRepository.create(payload);
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError("Failed to create product review");
        }
    }

    async getReviewsByProductId(productId: string) {
        try {
            return this.productReviewRepository.findAll({
                product_id: productId,
            });
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError("Failed to get reviews by product id");
        }
    }

    async deleteReview(id: string) {
        try {
            return this.productReviewRepository.delete({
                id,
            });
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError("Failed to delete review");
        }
    }

    async updateReview(id: string, updateProductReviewDto: UpdateProductReviewDto, userId: string) {
        try {
            const review = await this.productReviewRepository.findById(id);
            if (!review) {
                throw new BusinessLogicError("Review not found");
            }
            if (review.user_id !== userId) {
                throw new BusinessLogicError("You are not authorized to update this review");
            }

            console.log(updateProductReviewDto);


            const path = "product-" + review.product_id + "/" + "userId-" + userId;

            let newImages: string[] | null = null;
            if (updateProductReviewDto.files && updateProductReviewDto.files.length > 0) {
                newImages = await Promise.all(updateProductReviewDto.files?.map(async (file) => {
                    const image = await this.uploadService.uploadImage(
                        file,
                        path + "/" + file.filename,
                        'product-reviews'
                    );
                    return image;
                })) || null;
            }

            const { files, previous_images, ...rest } = updateProductReviewDto;
            const payload = {
                ...rest,
                variant_id: updateProductReviewDto.variant_id || undefined,
                images: [...updateProductReviewDto.previous_images, ...(newImages ?? [])],
            }

            return this.productReviewRepository.update({ id }, payload);
        } catch (error) {
            console.log(error);
            throw new BusinessLogicError("Failed to update review");
        }
    }
}