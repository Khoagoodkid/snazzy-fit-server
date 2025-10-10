import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { BusinessLogicError } from "src/core/base.error";
import { RedisService } from "src/redis/redis.service";
import { SerializeService } from "src/utils/serialize.service";

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository, private readonly redisService: RedisService) { }

    async getProducts({
        category_id,
        collection_id,
        limit,
        offset,
        keyword,
        styles,
        seasons,
        priceFrom,
        priceTo,
        sortBy,
        sortOrder,
    }: {
        category_id?: string,
        collection_id?: string,
        limit?: number,
        offset?: number,
        keyword?: string,
        styles?: string,
        seasons?: string,
        priceFrom?: number,
        priceTo?: number,
        sortBy?: string,
        sortOrder?: string,
    }) {
        try {

            console.log(styles);
            const where = {
                ...(category_id && { category_id: category_id }),
                ...(collection_id && { collection_id: collection_id }),
                ...(keyword && { name: { contains: keyword } }),
                ...(styles && { tags: { array_contains: styles.toLowerCase() } }),
                ...(seasons && { tags: { array_contains: seasons.toLowerCase() } }),
                ...(priceFrom && { basePrice: { gte: priceFrom } }),
                ...(priceTo && { basePrice: { lte: priceTo } }),
            }

            const include = {
                variants: true,
                category: true,
                collection: true,
            }

            let maxPrice = 0;
            if (collection_id) {
                const products = await this.productRepository.findByCollectionIdAndCategoryId(collection_id, (category_id ? category_id : undefined));
                maxPrice = products.reduce((max, product) => {
                    return Math.max(max, product.basePrice);
                }, 0);
            }

            const products = await this.productRepository.getProducts(where, limit, offset, include, sortBy, sortOrder);
            
           
            
            return {
                products,
                maxPrice,
            };

        } catch (error) {
            console.error(error);
            throw new BusinessLogicError("Failed to get products");
        }
    }

    async getById(id: string) {
        try {
            return this.productRepository.findById(id);
        } catch (error) {
            throw new BusinessLogicError("Failed to get product");
        }
    }

    async getBySlug(slug: string) {
        try {
            return this.productRepository.findBySlug(slug);
        } catch (error) {
            throw new BusinessLogicError("Failed to get product");
        }
    }
}    