import { Injectable } from "@nestjs/common";
import { CartRepository } from "./cart.repository";
import { CreateCartDto } from "./dto/create-cart.dto";
import { BusinessLogicError } from "src/core/base.error";
import { ProductService } from "src/product/product.service";
import { VariantService } from "src/variant/variant.service";
import { UpdateCartDto } from "./dto/update-cart.dto";

@Injectable()
export class CartService {
    constructor(private readonly cartRepository: CartRepository, private readonly variantService: VariantService) { }

    async getCart(userId: string) {
        try {
            return this.cartRepository.getCart(userId);
        } catch (error) {
            throw new BusinessLogicError("Failed to get cart");
        }
    }

    async addToCart(userId: string, createCartDto: CreateCartDto) {

        const product = await this.variantService.getById(createCartDto.variantId);
        if (!product) {
            throw new BusinessLogicError("Product not found");
        }

        if (createCartDto.quantity <= 0) {
            throw new BusinessLogicError("Quantity must be greater than 0");
        }
        try {
            return this.cartRepository.addToCart(userId, createCartDto.variantId, createCartDto.quantity);
        } catch (error) {
            throw new BusinessLogicError("Failed to add to cart");
        }
    }

    async removeCart(id: string) {
        try {
            return this.cartRepository.deleteById(id);
        } catch (error) {
            throw new BusinessLogicError("Failed to remove cart");
        }
    }

    async updateCart(id: string, updateCartDto: UpdateCartDto) {
        try {
            return this.cartRepository.updateCart({ id }, { quantity: updateCartDto.quantity });
        } catch (error) {
            throw new BusinessLogicError("Failed to update cart");
        }
    }
}