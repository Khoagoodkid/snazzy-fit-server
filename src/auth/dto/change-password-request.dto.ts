import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ChangePasswordRequestDto {
    @IsEmail()
    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty()
    email: string;
}
