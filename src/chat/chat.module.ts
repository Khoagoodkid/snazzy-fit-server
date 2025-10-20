import { forwardRef, Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatRepository } from "./chat.repository";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { ChatGateway } from "./chat.gateway";
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from "src/upload/upload.module";
import { SessionModule } from "src/session/session.module";
import { DiscordModule } from "src/discord/discord.module";


@Module({
    imports: [
        PrismaModule,
        UploadModule,
        ConfigModule,
        SessionModule,
        forwardRef(() => DiscordModule),
    ],
    controllers: [],
    providers: [ChatService, ChatRepository, ChatGateway],
    exports: [ChatService, ChatGateway],
})
export class ChatModule { }