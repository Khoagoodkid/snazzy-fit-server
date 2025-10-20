import { forwardRef, Module } from "@nestjs/common";
import { DiscordGateway } from "./discord.gateway";
import { ConfigModule } from "@nestjs/config";
import { SessionModule } from "src/session/session.module";
import { ChatModule } from "src/chat/chat.module";
import { DiscordService } from "./discord.service";

@Module({
    imports: [ConfigModule, SessionModule, forwardRef(() => ChatModule)],
    providers: [DiscordGateway, DiscordService],
    exports: [DiscordGateway, DiscordService], 
})
export class DiscordModule { }
