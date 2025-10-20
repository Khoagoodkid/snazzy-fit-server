import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionRepository } from './role-permission.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PermissionModule } from 'src/permission/permission.module';
import { forwardRef } from '@nestjs/common';
import { PermissionService } from 'src/permission/permission.service';
import { PermissionRepository } from 'src/permission/permission.repository';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [PrismaModule, forwardRef(() => PermissionModule), forwardRef(() => RoleModule)],
    controllers: [RolePermissionController],
    providers: [RolePermissionService, RolePermissionRepository, PermissionService, PermissionRepository],
    exports: [RolePermissionService],
})
export class RolePermissionModule { }

