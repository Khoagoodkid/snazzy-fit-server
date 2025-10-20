import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { SessionRepository } from "./session.repository";

@Module({
    controllers: [SessionController],
    providers: [SessionService, SessionRepository],
    exports: [SessionService],
})
export class SessionModule { }