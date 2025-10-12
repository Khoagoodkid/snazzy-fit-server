import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsArray, IsEnum } from "class-validator";
import { TicketType } from "@prisma/client";

export class CreateTicketDto {
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
    tags?: string[];


    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123', required: false })
    order_id?: string;
}