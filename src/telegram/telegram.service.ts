import { Injectable } from "@nestjs/common";
import { BusinessLogicError } from "src/core/base.error";
import { TelegramWebhookRequest } from "./request/webhook-request";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { OnModuleInit } from "@nestjs/common";
import { SessionService } from "src/session/session.service";
import { ChatService } from "src/chat/chat.service";
import { MessageRole } from "@prisma/client";
import { TimeService } from "src/utils/time.service";
import { SerializeService } from "src/utils/serialize.service";
import { ChatGateway } from "src/chat/chat.gateway";
import { ASSISTANT_ROOM } from "src/chat/chat.gateway";
import { TelegramPhoto } from "./request/webhook-request";

@Injectable()
export class TelegramService implements OnModuleInit {
    private axios: AxiosInstance;
    private readonly TELEGRAM_API_BASE_URL: string;
    private readonly mediaGroupMap: Map<string, string[]> = new Map();

    constructor(private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
        private readonly chatService: ChatService,
        private readonly chatGateway: ChatGateway
    ) {
        this.TELEGRAM_API_BASE_URL = 'https://api.telegram.org'
    }

    onModuleInit() {
        this.axios = axios.create({
            baseURL: `https://api.telegram.org/bot${this.configService.get('TELEGRAM_BOT_TOKEN')}`,
        });
        this.setWebhook();
    }
    async handleWebhook(request: TelegramWebhookRequest) {
        try {
            console.log("Webhook received:", request);
            if (request.message) {
                const message = request.message;
                const mediaGroupId = message.media_group_id;

                // if(message.text?.startsWith("/start")) {
                let session = await this.sessionService.getSessionByTelegramChatId(message.chat.id.toString());
                if (!session) {
                    session = await this.sessionService.createSessionByTelegramChatId(
                        message.chat.id.toString(),
                        message.from.username ?? null,
                        null);
                }
                let media: string[] | null = null;
                // if(message.photo && message.photo.length > 0) {
                //     media = await Promise.all(message.photo.slice(1,2).map(async (photo: TelegramPhoto) => {
                //         const filePath = await this.getFile(photo.file_id);
                //         return filePath;
                //     }));
                // }
                if (!mediaGroupId) {
                    if (message.photo && message.photo.length > 0) {
                        media = [await this.getFile(message.photo[1].file_id)];
                    }
                } else {
                    if (!this.mediaGroupMap.has(mediaGroupId)) {
                        this.mediaGroupMap.set(mediaGroupId, []);
                    }
                    const filePath = await this.getFile(message.photo?.[1]?.file_id ?? '');
                    this.mediaGroupMap.get(mediaGroupId)?.push(filePath);

                    setTimeout(() => {
                        if (mediaGroupId && this.mediaGroupMap.has(mediaGroupId)) {
                            media = this.mediaGroupMap.get(mediaGroupId) ?? null;
                            this.mediaGroupMap.delete(mediaGroupId);
                        }
                    }, 1000);
                }



                console.log(media);
                const createdMessage = await this.chatService.createMessage({
                    session_id: session.id,
                    content: message.text ?? '',
                    media: media,
                    role: MessageRole.USER,
                    created_at: TimeService.currentUnix(),
                });

                await this.chatGateway.emitToRoom(ASSISTANT_ROOM, 'receiveMessage', {
                    message: SerializeService.serializeBigInt(createdMessage),
                });
                // } 
                await this.sendMessage(message.chat.id.toString(), "Hello, I'm a Snazzy Fit Bot. How can I help you today?");
                const botMessage = await this.chatService.createMessage({
                    session_id: session.id,
                    content: "Hello, I'm a Snazzy Fit Bot. How can I help you today?",
                    role: MessageRole.ASSISTANT,
                    created_at: TimeService.currentUnix(),
                });
                // Emit to socket.io clients
                await this.chatGateway.emitToRoom(ASSISTANT_ROOM, 'receiveMessage', {
                    message: SerializeService.serializeBigInt(botMessage),
                });

            }
        } catch (error) {
            throw new BusinessLogicError("Failed to handle webhook");
        }
    }

    async setWebhook() {
        try {
            await this.axios.post(`/setWebhook`, {
                url: `${this.configService.get('SERVER_BASE_URL')}/api/telegram/webhook`,
                allowed_updates: ['message', 'callback_query'],
            });
            console.log("Webhook set successfully");
        } catch (error) {
            throw new BusinessLogicError("Failed to set webhook");
        }
    }

    async sendMessage(chatId: string, message: string) {
        try {
            await this.axios.post(`/sendMessage`, {
                chat_id: chatId,
                text: message,
            });
            console.log("Message sent successfully");
        } catch (error) {
            throw new BusinessLogicError("Failed to send message");
        }
    }

    async getFile(fileId: string) {
        try {
            const response = await this.axios.get(`/getFile`, {
                params: {
                    file_id: fileId,
                },
            });
            return this.TELEGRAM_API_BASE_URL + "/file/bot" + this.configService.get('TELEGRAM_BOT_TOKEN') + "/" + response.data.result.file_path;
        } catch (error) {
            throw new BusinessLogicError("Failed to get file");
        }
    }
}