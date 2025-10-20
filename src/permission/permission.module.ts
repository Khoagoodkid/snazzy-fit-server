import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [PrismaModule, 
        forwardRef(() => RolePermissionModule),
        forwardRef(() => RoleModule),
    ],
    controllers: [PermissionController],
    providers: [PermissionService, PermissionRepository],
    exports: [PermissionService],
})
export class PermissionModule {}

