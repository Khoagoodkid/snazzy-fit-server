import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({ example: 'users.create', description: 'Permission name' })
    @IsNotEmpty({ message: 'Permission name is required' })
    @IsString({ message: 'Permission name must be a string' })
    @MinLength(2, { message: 'Permission name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Permission name must be at most 100 characters long' })
    name: string;
}

