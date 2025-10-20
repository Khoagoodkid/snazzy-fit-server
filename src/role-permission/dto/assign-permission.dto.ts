import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class AssignPermissionDto {
    @ApiProperty({ example: 'role-uuid' })
    @IsNotEmpty({ message: 'Role ID is required' })
    @IsUUID('4', { message: 'Role ID must be a valid UUID' })
    roleId: string;

    @ApiProperty({ example: 'permission-uuid' })
    @IsNotEmpty({ message: 'Permission ID is required' })
    @IsUUID('4', { message: 'Permission ID must be a valid UUID' })
    permissionId: string;

    @ApiProperty({ example: 1, description: 'Status (0 = inactive, 1 = active)' })
    @IsNotEmpty({ message: 'Status is required' })
    status: number;
}