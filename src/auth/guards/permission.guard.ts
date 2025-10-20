import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Api403Error } from "src/core/base.error";
import { RolePermissionService } from "src/role-permission/role-permission.service";
import { PermissionService } from "src/permission/permission.service";
import { RoleService } from "src/role/role.service";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly rolePermissionService: RolePermissionService,
        private readonly permissionService: PermissionService,
        private readonly roleService: RoleService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission = this.reflector.get<string>(
            'permission',
            context.getHandler(),
        );

        if (!requiredPermission)
            throw new Api403Error('Permission metadata is missing');

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user)
            throw new Api403Error('User not found');

        console.log("user", user);
        const role = user.role;

        if (!role)
            throw new Api403Error('User role not found');

        if (role === 'SUPER_ADMIN')
            return true;

        const getPermission = await this.permissionService.getPermissionByName(requiredPermission);
        const getRole = await this.roleService.findByName(role);


        if (!getPermission)
            throw new Api403Error('Permission not found');

        if (!getRole)
            throw new Api403Error('Role not found');

        console.log("1", getRole);  
        console.log("2", getPermission);

        const getRolePermission = await this.rolePermissionService.findByRoleIdAndPermissionId(getRole.id, getPermission.id);

        console.log("3", getRolePermission);

        if (getRolePermission.length === 0 || getRolePermission[0].status === 0)
            throw new Api403Error('User does not have permission to access this resource');


        return true;
    }
}