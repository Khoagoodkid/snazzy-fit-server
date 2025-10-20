import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePermissionDto {
    @ApiProperty({ example: 'users.update', description: 'Permission name', required: false })
    @IsOptional()
    @IsString({ message: 'Permission name must be a string' })
    @MinLength(2, { message: 'Permission name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Permission name must be at most 100 characters long' })
    name?: string;
}

