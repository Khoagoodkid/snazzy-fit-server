import { Injectable } from "@nestjs/common";
import { RolePermissionRepository } from "./role-permission.repository";
import { BusinessLogicError } from "src/core/base.error";
import { AssignPermissionDto } from "./dto/assign-permission.dto";

@Injectable()
export class RolePermissionService {
    constructor(private readonly rolePermissionRepository: RolePermissionRepository) { }

    async upsertMany(assignPermissionDtos: AssignPermissionDto[]) {
        try {
            console.log("assignPermissionDtos", assignPermissionDtos);
            const data = await Promise.all(assignPermissionDtos.map(async assignPermissionDto => {
                this.rolePermissionRepository.upsert(
                    { role_id_permission_id: { role_id: assignPermissionDto.roleId, permission_id: assignPermissionDto.permissionId } },
                    { status: assignPermissionDto.status },
                    {
                        role: { connect: { id: assignPermissionDto.roleId } },
                        permission: { connect: { id: assignPermissionDto.permissionId } },
                        status: assignPermissionDto.status
                    }
                );
            }));
            return data;
        }

        catch (error) {
            throw new BusinessLogicError('Failed to upsert role permission');
        }
    }

    async create(roleId: string, permissionId: string) {
        try {
            return this.rolePermissionRepository.create({
                role: { connect: { id: roleId } },
                permission: { connect: { id: permissionId } },
                status: 1
            });
        } catch (error) {
            throw new BusinessLogicError('Failed to create role permission');
        }
    }

    async findAll(limit?: number, offset?: number, roleId?: string, permissionId?: string) {
        try {
            const where: any = {};
            if (roleId) where.role_id = roleId;
            if (permissionId) where.permission_id = permissionId;

            return this.rolePermissionRepository.findAll(where, limit, offset);
        } catch (error) {
            throw new BusinessLogicError('Failed to fetch role permissions');
        }
    }

    async findByRoleIdAndPermissionId(roleId: string, permissionId: string) {
        try {
            return this.rolePermissionRepository.findAll({ role_id: roleId, permission_id: permissionId });
        } catch (error) {
            throw new BusinessLogicError('Failed to fetch role permission');
        }
    }

    async updateByRoleAndPermission(roleId: string, permissionId: string, status: number) {
        try {
            return this.rolePermissionRepository.update({ role_id_permission_id: { role_id: roleId, permission_id: permissionId } }, { status });
        } catch (error) {
            throw new BusinessLogicError('Failed to update role permission');
        }
    }

    async update(id: string, status: number) {
        try {
            return this.rolePermissionRepository.update({ id }, { status });
        } catch (error) {
            throw new BusinessLogicError('Failed to update role permission');
        }
    }

    async delete(id: string) {
        try {
            return this.rolePermissionRepository.delete(id);
        } catch (error) {
            throw new BusinessLogicError('Failed to delete role permission');
        }
    }
}
