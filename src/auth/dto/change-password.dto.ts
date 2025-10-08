import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ example: 'password' })
    @IsNotEmpty()
    password: string;

    @IsString()
    @ApiProperty({ example: 'token' })
    @IsNotEmpty()
    token: string;
}
