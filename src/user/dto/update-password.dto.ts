import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    new_password: string;

    @IsNotEmpty()
    @IsString()
    old_password: string;
}
