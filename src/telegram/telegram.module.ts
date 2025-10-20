import { Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { ConfigModule } from "@nestjs/config";
import { TelegramController } from "./telegram.controller";
import { ChatModule } from "src/chat/chat.module";
import { SessionModule } from "src/session/session.module";

@Module({
    imports: [ConfigModule, ChatModule, SessionModule],
    controllers: [TelegramController],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule { }