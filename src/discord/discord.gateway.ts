// src/discord/discord.gateway.ts
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { MessageRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { SessionService } from 'src/session/session.service';
import { ChatService } from 'src/chat/chat.service';
import { TimeService } from 'src/utils/time.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { SerializeService } from 'src/utils/serialize.service';

const ASSISTANT_ROOM = "ASSISTANT";

@Injectable()
export class DiscordGateway implements OnModuleInit {
    private client: Client;

    constructor(private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
        private readonly chatService: ChatService,
        @Inject(forwardRef(() => ChatGateway))
        private readonly chatGateway: ChatGateway) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
    }
    async onModuleInit() {


        this.client.once('ready', () => {
            console.log(`🤖 Logged in as ${this.client.user?.tag}`);
        });

        this.client.on('messageCreate', async (msg) => {
            console.log("Message received:", msg);


            let session = await this.sessionService.getSessionByDiscordChannel(msg.channel.id);
            const avatar = msg.author.displayAvatarURL({ size: 1024 });
            console.log(avatar);
            if (!session) {
                session = await this.sessionService.createSessionByDiscordChannel(msg.channel.id, msg.author.username, avatar);
            }

            const media = msg.attachments.map(attachment => attachment.url) || [];
            const createdMessage = await this.chatService.createMessage({
                session_id: session.id,
                content: msg.content,
                media: media,
                role: msg.author.bot ? MessageRole.BOT : MessageRole.USER,
                created_at: TimeService.currentUnix(),
            });

            // Emit to socket.io clients
            const socketServer = this.chatGateway.getServer();
            if (socketServer) {
                socketServer.to(ASSISTANT_ROOM).emit('receiveMessage', {
                    message: SerializeService.serializeBigInt(createdMessage),
                });
            }

            if (msg.author.bot) {
                return;
            }
            await msg.channel.send("Hello, I'm a Snazzy Fit Bot. How can I help you today?");
        });

        await this.client.login(this.configService.get('DISCORD_BOT_TOKEN'));
    }

    async sendMessage(channelId: string, { content, files }: { content: string, files: string[] }) {
        const channel = await this.client.channels.cache.get(channelId);
        if (channel && channel.isTextBased()) { 
            await (channel as TextChannel).send({
                content: content,
                files: files.map(file => {
                    return {
                        attachment: file,
                    };
                }),
            });
        }
    }

    getClient() {
        return this.client;
    }
}
