import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAddressDto { 
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'John' })
    customer_first_name: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Doe' })
    customer_last_name: string;
    
    
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Company Name' })
    company_name?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123 Main St' })
    address: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'New York' })
    city: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'NY' })
    state: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '10001' })
    zip: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'USA' })
    country: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '+1234567890' })
    phone: string;

}