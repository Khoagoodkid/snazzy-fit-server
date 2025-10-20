import { Injectable } from "@nestjs/common";
import { DiscordGateway } from "./discord.gateway";

@Injectable()
export class DiscordService {
    constructor(private readonly discordGateway: DiscordGateway) { }

    async sendMessage(channelId: string, { content, files }: { content: string, files: string[] }) {
        return this.discordGateway.sendMessage(channelId, {
            content: content,
            files: files,
        });
    }
}