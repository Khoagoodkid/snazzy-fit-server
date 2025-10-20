import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'Admin', description: 'Role name' })
    @IsNotEmpty({ message: 'Role name is required' })
    @IsString({ message: 'Role name must be a string' })
    @MinLength(2, { message: 'Role name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Role name must be at most 50 characters long' })
    name: string;
}

