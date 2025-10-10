import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCheckoutSessionDto {
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsNotEmpty()
    @IsString()
    currency: string;


}