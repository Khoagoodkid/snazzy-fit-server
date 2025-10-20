import { Controller, Patch, Req, Res, UseGuards, Body, UseInterceptors, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { FastifyRequest, FastifyReply } from "fastify";
import { GetResponse, UpdatedResponse } from "src/core/successResponse";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ParseMultipartFormInterceptor } from "src/interceptors/parse-formdata";
import { PermissionGuard } from "src/auth/guards/permission.guard";
import { Permission } from "src/auth/decorators/permission.decorators";
import { PermissionStore } from "src/constants/permission.constants";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('/admin/get-all')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.GET_USERS)
    async getAllUsers(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const data = await this.userService.getAllUsers();
        return reply.send(new GetResponse({
            data: data,
            message: 'Users fetched successfully',
        }));
    }
    
    @Patch('me')
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateUserDto })
    @UseInterceptors(ParseMultipartFormInterceptor)
    async updateUser(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const updateUserDto = req.body as UpdateUserDto;
        const data = await this.userService.updateProfile(userId, updateUserDto);
        return reply.send(new UpdatedResponse({
            data: data,
            message: 'User updated successfully',
        }));
    }

    @Patch('me/password')
    @UseGuards(JwtAuthGuard)
    async updatePassword(@Req() req: FastifyRequest, @Res() reply: FastifyReply, @Body() updatePasswordDto: UpdatePasswordDto) {
        const userId = (req as any).user.id;
        const data = await this.userService.updatePassword(userId, updatePasswordDto);
        return reply.send(new UpdatedResponse({
            data: data,
            message: 'Password updated successfully',
        }));
    }

}