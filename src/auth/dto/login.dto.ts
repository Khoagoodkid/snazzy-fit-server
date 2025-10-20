import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @ApiProperty({ example: 'Password@123' })
    @IsNotEmpty()
    password: string;


}