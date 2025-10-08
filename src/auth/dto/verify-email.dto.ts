import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDto {
    @IsString()
    @ApiProperty({ example: 'verify_token' })
    @IsNotEmpty()
    verify_token: string;
}