import { Module } from "@nestjs/common";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { TicketRepository } from "./ticket.repository";
import { UploadModule } from "src/upload/upload.module";
import { UserModule } from "src/user/user.module";
import { PermissionModule } from "src/permission/permission.module";
import { RolePermissionModule } from "src/role-permission/role-permission.module";
import { RoleModule } from "src/role/role.module";

@Module({
    imports: [
        UploadModule,
        UserModule,
        PermissionModule,
        RolePermissionModule,
        RoleModule,
    ],
    controllers: [TicketController],
    providers: [TicketService, TicketRepository],
    exports: [TicketService, TicketRepository],
})
export class TicketModule { }