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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FastifyReply } from 'fastify';
import { CreatedResponse, DeletedResponse, GetResponse } from 'src/core/successResponse';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/auth/decorators/permission.decorators';
import { PermissionStore } from 'src/constants/permission.constants';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.CREATE_ROLE)
    async create(@Body() createRoleDto: CreateRoleDto, @Res() reply: FastifyReply) {
        const data = await this.roleService.create(createRoleDto);
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Role created successfully',
            })
        );
    }

    @Get()
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.GET_ROLES)
    async findAll(
        @Res() reply: FastifyReply,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('keyword') keyword?: string
    ) {
        const { data, total } = await this.roleService.findAll(limit, offset, keyword);
        return reply.send(
            new GetResponse({
                data,
                message: 'Roles fetched successfully',
                totalRecord: total,
            })
        );
    }

    @Get(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.GET_ROLE_BY_ID)
    async findOne(@Param('id') id: string, @Res() reply: FastifyReply) {
        const data = await this.roleService.findOne(id);
        return reply.send(
            new GetResponse({
                data,
                message: 'Role fetched successfully',
            })
        );
    }

    @Patch(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.UPDATE_ROLE)
    async update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
        @Res() reply: FastifyReply
    ) {
        const data = await this.roleService.update(id, updateRoleDto);
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Role updated successfully',
            })
        );
    }

    @Delete(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.DELETE_ROLE)
    async remove(@Param('id') id: string, @Res() reply: FastifyReply) {
        const data = await this.roleService.remove(id);
        return reply.send(
            new DeletedResponse({
                data,
                message: 'Role deleted successfully',
            })
        );
    }
}

