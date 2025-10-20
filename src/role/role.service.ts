import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BusinessLogicError } from 'src/core/base.error';
import { TimeService } from 'src/utils/time.service';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) { }

    async create(createRoleDto: CreateRoleDto) {
        try {
            // Check if role name already exists
            const existingRole = await this.roleRepository.findByName(createRoleDto.name);
            if (existingRole) {
                throw new BusinessLogicError('Role name already exists');
            }

            // Create role
            const role = await this.roleRepository.create({
                name: createRoleDto.name,
                created_at: TimeService.currentUnix(),
                updated_at: TimeService.currentUnix(),
            });


            // Return role with permissions
            return role;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to create role');
        }
    }

    async findAll(limit?: number, offset?: number, keyword?: string) {
        try {
            const where = keyword ? { name: { contains: keyword } } : {};
            const roles = await this.roleRepository.findAll(where, limit, offset);
            const total = await this.roleRepository.count(where);

            return {
                data: roles,
                total,
            };
        } catch (error) {
            throw new BusinessLogicError('Failed to fetch roles');
        }
    }

    async findByName(name: string) {

        try {
            const role = await this.roleRepository.findByName(name);
            return role;
        } catch (error) {
            throw new BusinessLogicError('Failed to fetch role');
        }
    }

    async findOne(id: string) {
        try {
            const role = await this.roleRepository.findById(id);
            if (!role) {
                throw new BusinessLogicError('Role not found');
            }
            return role;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to fetch role');
        }
    }

    async update(id: string, updateRoleDto: UpdateRoleDto) {
        try {
            // Check if role exists
            const existingRole = await this.roleRepository.findById(id);
            if (!existingRole) {
                throw new BusinessLogicError('Role not found');
            }

            // Check if name is being updated and if it already exists
            if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
                const roleWithSameName = await this.roleRepository.findByName(updateRoleDto.name);
                if (roleWithSameName) {
                    throw new BusinessLogicError('Role name already exists');
                }
            }

            // Update role
            const updateData: any = {
                updated_at: TimeService.currentUnix(),
            };

            if (updateRoleDto.name) {
                updateData.name = updateRoleDto.name;
            }

            const updatedRole = await this.roleRepository.update(id, updateData);


            // Return updated role with permissions
            return updatedRole;
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to update role');
        }
    }

    async remove(id: string) {
        try {
            const existingRole = await this.roleRepository.findById(id);
            if (!existingRole) {
                throw new BusinessLogicError('Role not found');
            }

            await this.roleRepository.delete(id);
            return { message: 'Role deleted successfully' };
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                throw error;
            }
            throw new BusinessLogicError('Failed to delete role');
        }
    }
}

