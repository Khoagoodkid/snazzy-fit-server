import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123', description: 'Cart ID' })
    cart_id: string | null;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123', description: 'Variant ID' })
    variant_id: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 2, description: 'Quantity' })
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 100, description: 'Unit price in cents' })
    unit_price: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 200, description: 'Total price in cents' })
    total_price: number;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @ApiProperty({ 
        type: [OrderItemDto],
        description: 'Order items',
        example: [{ cart_id: '123', variant_id: '123', quantity: 2, unit_price: 100, total_price: 200 }]
    })
    items: OrderItemDto[];

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 10, description: 'Shipping amount' })
    shipping_amount: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 10, description: 'Shipping amount' })
    tax_amount: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 10, description: 'Tax amount' })
    sub_total: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 10, description: 'Total amount' })
    total_amount: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'USD', description: 'Currency' })
    payment_method: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'John Doe', description: 'Customer name' })
    customer_name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'john.doe@example.com', description: 'Customer email' })
    customer_email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '+1234567890', description: 'Customer phone number' })
    customer_phone: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123 Main St', description: 'Customer address' })
    customer_address: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'New York', description: 'Customer city' })
    customer_city: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'NY', description: 'Customer state' })
    customer_state: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '10001', description: 'Customer ZIP code' })
    customer_zip: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'USA', description: 'Customer country' })
    customer_country: string;
}