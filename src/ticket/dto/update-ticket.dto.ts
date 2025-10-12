import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsArray, IsOptional, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { TicketType } from "@prisma/client";

export class UpdateTicketDto {
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
    @ApiProperty({ example: '123' })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123' })
    description: string;

    @IsNotEmpty()
    @IsEnum(TicketType)
    @ApiProperty({ example: 'GENERAL' })
    type: TicketType;


    @IsOptional()
    @IsArray()
    @ApiProperty({ example: ['123', '456'], required: false })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    tags?: string[];

    @IsArray()
    @ApiProperty({ example: ['123', '456'] })
    @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
    previous_images: string[];

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123', required: false })
    order_id?: string;
}
