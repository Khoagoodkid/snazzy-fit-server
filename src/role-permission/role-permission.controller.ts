import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { FastifyReply } from 'fastify';
import { CreatedResponse, DeletedResponse, GetResponse } from 'src/core/successResponse';
import { ApiQuery, ApiTags, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/auth/decorators/permission.decorators';
import { PermissionStore } from 'src/constants/permission.constants';


class UpdateRolePermissionDto {
    @ApiProperty({ example: 1, description: 'Status (0 = inactive, 1 = active)' })
    @IsNotEmpty({ message: 'Status is required' })
    status: number;
}

@ApiTags('Role Permissions')
@Controller('role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Post()
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.CREATE_ROLE_PERMISSION)
    async create(@Body() assignPermissionDto: AssignPermissionDto, @Res() reply: FastifyReply) {
        const data = await this.rolePermissionService.create(
            assignPermissionDto.roleId,
            assignPermissionDto.permissionId,
        );
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Permission assigned to role successfully',
            })
        );
    }

    @Post('upsert')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.CREATE_ROLE_PERMISSION)
    async upsert(@Body() assignPermissionDtos: AssignPermissionDto[], @Res() reply: FastifyReply) {
        const data = await this.rolePermissionService.upsertMany(assignPermissionDtos);
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Role permission upserted successfully',
            })
        );
    }

    @Get()
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'roleId', required: false })
    @ApiQuery({ name: 'permissionId', required: false })
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.GET_ROLE_PERMISSIONS)
    async findAll(
        @Res() reply: FastifyReply,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('roleId') roleId?: string,
        @Query('permissionId') permissionId?: string
    ) {
        const data = await this.rolePermissionService.findAll(limit, offset, roleId, permissionId);
        return reply.send(
            new GetResponse({
                data,
                message: 'Role permissions fetched successfully',
                totalRecord: data.length,
            })
        );
    }

    @Patch(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.UPDATE_ROLE_PERMISSION)
    async update(
        @Param('id') id: string,
        @Body() updateRolePermissionDto: UpdateRolePermissionDto,
        @Res() reply: FastifyReply
    ) {
        const data = await this.rolePermissionService.update(id, updateRolePermissionDto.status);
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Role permission updated successfully',
            })
        );
    }

    @Patch('/role/:roleId/permission/:permissionId')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.UPDATE_ROLE_PERMISSION)
    async updateByRoleAndPermission(
        @Param('roleId') roleId: string,
        @Param('permissionId') permissionId: string,
        @Body() updateRolePermissionDto: UpdateRolePermissionDto,
        @Res() reply: FastifyReply
    ) {
        const data = await this.rolePermissionService.updateByRoleAndPermission(roleId, permissionId, updateRolePermissionDto.status);
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Role permission updated successfully',
            })
        );
    }

    @Delete(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.DELETE_ROLE_PERMISSION)
    async remove(@Param('id') id: string, @Res() reply: FastifyReply) {
        await this.rolePermissionService.delete(id);
        return reply.send(
            new DeletedResponse({
                data: { id },
                message: 'Role permission deleted successfully',
            })
        );
    }
}

