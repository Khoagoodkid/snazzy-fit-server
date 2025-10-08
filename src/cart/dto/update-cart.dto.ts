import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCartDto {
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}