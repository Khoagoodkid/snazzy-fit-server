import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductReviewDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
        required: false
    })
    files: any[];

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123', })
    product_id: string;


    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123', required: false })
    variant_id?: string;


    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 5 })
    rating: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'This is a comment' })
    comment: string;
}