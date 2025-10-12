import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
    @IsNotEmpty()
    @IsString()
    cart_id: string | null;
    @IsNotEmpty()
    @IsString()
    order_id: string;
    @IsNotEmpty()
    @IsString()
    variant_id: string;
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    @IsNotEmpty()
    @IsNumber()
    unit_price: number;
    @IsNotEmpty()
    @IsNumber()
    total_price: number;    
}