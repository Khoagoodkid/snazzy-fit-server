import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSessionByTicketDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123' })
    ticketId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123' })
    userId: string;

}