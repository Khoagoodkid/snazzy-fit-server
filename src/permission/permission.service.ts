import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { BusinessLogicError } from 'src/core/base.error';
import { TimeService } from 'src/utils/time.service';

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepository: PermissionRepository) {}

    async create(permissionDtos: CreatePermissionDto[]) {
        try {
            const permission = await this.permissionRepository.createMany(permissionDtos);

            return permission;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to create permission');
        }
    }

    async getPermissionByName(name: string) {
        try {
            const permission = await this.permissionRepository.findByName(name);
            return permission;
        } catch (error) {
            throw new BusinessLogicError('Failed to get permission by name');
        }
    }

    async findAll(limit?: number, offset?: number, keyword?: string) {
        try {
            const where = keyword ? { name: { contains: keyword } } : {};
            const permissions = await this.permissionRepository.findAll(where, limit, offset);
            const total = await this.permissionRepository.count(where);

            return {
                data: permissions,
                total,
            };
        } catch (error) {
            throw new BusinessLogicError('Failed to fetch permissions');
        }
    }

    async findOne(id: string) {
        try {
            const permission = await this.permissionRepository.findById(id);
            if (!permission) {
                throw new BusinessLogicError('Permission not found');
            }
            return permission;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to fetch permission');
        }
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto) {
        try {
            // Check if permission exists
            const existingPermission = await this.permissionRepository.findById(id);
            if (!existingPermission) {
                throw new BusinessLogicError('Permission not found');
            }

            // Check if name is being updated and if it already exists
            if (
                updatePermissionDto.name &&
                updatePermissionDto.name !== existingPermission.name
            ) {
                const permissionWithSameName = await this.permissionRepository.findByName(
                    updatePermissionDto.name
                );
                if (permissionWithSameName) {
                    throw new BusinessLogicError('Permission name already exists');
                }
            }

            // Update permission
            const updateData: any = {
                updated_at: TimeService.currentUnix(),
            };

            if (updatePermissionDto.name) {
                updateData.name = updatePermissionDto.name;
            }

            return this.permissionRepository.update(id, updateData);
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to update permission');
        }
    }

    async remove(id: string) {
        try {
            const existingPermission = await this.permissionRepository.findById(id);
            if (!existingPermission) {
                throw new BusinessLogicError('Permission not found');
            }

            await this.permissionRepository.delete(id);
            return { message: 'Permission deleted successfully' };
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to delete permission');
        }
    }
}

