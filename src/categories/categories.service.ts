import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { BusinessLogicError } from "src/core/base.error";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    async getCategories(limit?: number, offset?: number, keyword?: string) {
        try {

            const where = {
                ...(keyword && { name: { contains: keyword } }),
            }

            const categories = await this.categoriesRepository.getCategories(where, limit, offset, {
                products: true,
            });

           
            return categories;
        } catch (error) {
            throw new BusinessLogicError("Failed to get categories");
        }
    }
}   