import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { PasswordService } from "src/utils/password.service";
import { HashService } from "src/utils/hash.service";
import { UploadService } from "src/upload/upload.service";
import { RoleModule } from "src/role/role.module";
import { PermissionModule } from "src/permission/permission.module";
import { RolePermissionModule } from "src/role-permission/role-permission.module";

@Module({
    imports: [
        PrismaModule,
        RoleModule,
        PermissionModule,
        RolePermissionModule,
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository, PasswordService, HashService, UploadService],
    exports: [UserService],
})
export class UserModule {}