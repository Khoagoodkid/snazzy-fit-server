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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FastifyReply } from 'fastify';
import { CreatedResponse, DeletedResponse, GetResponse } from 'src/core/successResponse';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/auth/decorators/permission.decorators';
import { PermissionStore } from 'src/constants/permission.constants';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.CREATE_PERMISSION)
    async create(@Body() permissionDtos: CreatePermissionDto[], @Res() reply: FastifyReply) {
        const data = await this.permissionService.create(permissionDtos);
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Permission created successfully',
            })
        );
    }

    @Get()
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.GET_PERMISSIONS)
    async findAll(
        @Res() reply: FastifyReply,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('keyword') keyword?: string
    ) {
        const { data, total } = await this.permissionService.findAll(limit, offset, keyword);
        return reply.send(
            new GetResponse({
                data,
                message: 'Permissions fetched successfully',
                totalRecord: total,
            })
        );
    }

    @Get(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.GET_PERMISSION_BY_ID)
    async findOne(@Param('id') id: string, @Res() reply: FastifyReply) {
        const data = await this.permissionService.findOne(id);
        return reply.send(
            new GetResponse({
                data,
                message: 'Permission fetched successfully',
            })
        );
    }

    @Patch(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.UPDATE_PERMISSION)
    async update(
        @Param('id') id: string,
        @Body() updatePermissionDto: UpdatePermissionDto,
        @Res() reply: FastifyReply
    ) {
        const data = await this.permissionService.update(id, updatePermissionDto);
        return reply.send(
            new CreatedResponse({
                data,
                message: 'Permission updated successfully',
            })
        );
    }

    @Delete(':id')
    @UseGuards(PermissionGuard, JwtAuthGuard)
    @Permission(PermissionStore.DELETE_PERMISSION)
    async remove(@Param('id') id: string, @Res() reply: FastifyReply) {
        const data = await this.permissionService.remove(id);
        return reply.send(
            new DeletedResponse({
                data,
                message: 'Permission deleted successfully',
            })
        );
    }
}

