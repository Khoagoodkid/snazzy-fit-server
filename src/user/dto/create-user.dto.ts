import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'James' })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(20, {
        message: 'Username must be at most 20 characters long',
    })
    @Matches(/^[A-Za-zÀ-ỹ0-9 ]+$/, {
        message: 'Username must contain only letters, numbers and spaces',
    })
    username: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email is invalid' })
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'Email must contain only letters, numbers, and valid characters',
    })
    email: string;

    @ApiProperty({ example: 'Password@123' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(20, { message: 'Password must be at most 20 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/, {
        message:
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character from the following: @$!%*?&',
    })
    password: string;


}
