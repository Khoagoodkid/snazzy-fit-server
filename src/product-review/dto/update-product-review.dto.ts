import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateProductReviewDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
        required: false
    })
    files: any[];


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


    @IsArray()
    @ApiProperty({ example: ['123', '456'] })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    previous_images: string[];
}