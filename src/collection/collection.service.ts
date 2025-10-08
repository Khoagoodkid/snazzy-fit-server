import { Injectable } from "@nestjs/common";
import { CollectionRepository } from "./collection.repository";
import { BusinessLogicError } from "src/core/base.error";
import { CategoriesService } from "src/categories/categories.service";
import { ProductService } from "src/product/product.service";
import { Category } from "@prisma/client";
import { RedisService } from "src/redis/redis.service";
import { SerializeService } from "src/utils/serialize.service";

@Injectable()
export class CollectionService {
    constructor(private readonly collectionRepository: CollectionRepository,
        private readonly categoriesService: CategoriesService,
        private readonly productService: ProductService,
        private readonly redisService: RedisService,
    ) { }

    async getCollections(limit?: number, offset?: number, keyword?: string) {
        try {

            const where = {
                ...(keyword && { name: { contains: keyword } }),
            }

            return this.collectionRepository.getCollections(where, limit, offset);
        } catch (error) {
            throw new BusinessLogicError("Failed to get products");
        }
    }

    async getCollectionsWithCategories() {
        try {
            const collections = await this.collectionRepository.getCollections();
            const categories = await this.categoriesService.getCategories();

            const cacheKey = `collectionsWithCategories`;

            try {
                const cachedCollectionsWithCategories = await this.redisService.get(cacheKey);
                if (cachedCollectionsWithCategories) {
                    console.log('Hit key:', cacheKey);
                    return JSON.parse(cachedCollectionsWithCategories);
                }
            } catch (error) {
                console.log('Cache read error (continuing without cache):', error.message);
            }

            const collectionsWithCategories = await Promise.all(
                collections.map(async collection => {
                    const cats: any[] = [];

                    await Promise.all(
                        categories.map(async category => {
                            const data = await this.productService.getProducts({ category_id: category.id, collection_id: collection.id });
                            if (data.products.length > 0) {
                                cats.push(category);
                            }
                        })
                    );

                    return {
                        ...collection,
                        categories: cats,
                    };
                })
            );

            try {
                const serializedCollectionsWithCategories = SerializeService.serializeBigInt(collectionsWithCategories);

                const cacheResult = await this.redisService.set(cacheKey, JSON.stringify(serializedCollectionsWithCategories), 300);
                if (cacheResult) {
                    console.log('Miss key:', cacheKey);
                }
            } catch (error) {
                console.log('Cache write error (continuing without caching):', error.message);
            }

            return collectionsWithCategories;
        } catch (error) {
            throw new BusinessLogicError("Failed to get collections with categories");
        }
    }

}   