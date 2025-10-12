import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class UpdateUserDto {
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    file?: any;


    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '1234567890' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({ example: 'Male' })
    @IsNotEmpty()
    @IsString()
    gender: string;
}
