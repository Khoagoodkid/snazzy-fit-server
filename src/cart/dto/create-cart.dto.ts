import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCartDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123' })
    variantId: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 1 })
    quantity: number;

}