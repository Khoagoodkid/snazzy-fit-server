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
}