import { Module } from "@nestjs/common";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { TicketRepository } from "./ticket.repository";
import { UploadModule } from "src/upload/upload.module";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        UploadModule,
        UserModule,
    ],
    controllers: [TicketController],
    providers: [TicketService, TicketRepository],
    exports: [TicketService, TicketRepository],
})
export class TicketModule { }