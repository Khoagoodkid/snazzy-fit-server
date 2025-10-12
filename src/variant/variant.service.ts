import { VariantRepository } from "./variant.repository";
import { BusinessLogicError } from "src/core/base.error";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VariantService {   
    constructor(private readonly variantRepository: VariantRepository) { }

    async getById(id: string) {
        try {
            return this.variantRepository.findById(id);
        } catch (error) {
            throw new BusinessLogicError("Failed to get variant");
        }
    }

    async getAll() {
        try {
            return this.variantRepository.findAll();
        } catch (error) {
            console.error(error);
            throw new BusinessLogicError("Failed to get all variants");
        }
    }

    async updateStockMany(variants: { id: string; by: number }[]) {
        try {

            Promise.all(variants.map(async (variant) => {
                await this.variantRepository.update({ id: variant.id }, { stock: { decrement: variant.by } });
            }));
        } catch (error) {
            throw new BusinessLogicError("Failed to update stock");
        }
    }
}