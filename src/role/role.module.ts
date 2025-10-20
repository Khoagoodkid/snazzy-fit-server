import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';

@Module({
    imports: [
        PrismaModule,
        forwardRef(() => RoleModule),
        forwardRef(() => PermissionModule),
        forwardRef(() => RolePermissionModule),
    ],
    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService],
})
export class RoleModule {}

