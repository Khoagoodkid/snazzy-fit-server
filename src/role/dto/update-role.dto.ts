import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, IsArray, IsUUID } from 'class-validator';

export class UpdateRoleDto {
    @ApiProperty({ example: 'Admin', description: 'Role name', required: false })
    @IsOptional()
    @IsString({ message: 'Role name must be a string' })
    @MinLength(2, { message: 'Role name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Role name must be at most 50 characters long' })
    name?: string;


}

