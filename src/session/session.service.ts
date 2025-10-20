import { Injectable } from "@nestjs/common";
import { SessionRepository } from "./session.repository";
import { BusinessLogicError } from "src/core/base.error";
import { TimeService } from "src/utils/time.service";
import { Prisma, SessionSource } from "@prisma/client";
import { CreateSessionByTicketDto } from "./dto/create-session-by-ticket.dto";

@Injectable()
export class SessionService {
    constructor(private readonly sessionRepository: SessionRepository) { }

    async createSessionByTicket(createSessionByTicketDto: CreateSessionByTicketDto, assistantId: string) {
        try {
            return this.sessionRepository.create({
                ticket: {
                    connect: {
                        id: createSessionByTicketDto.ticketId,
                    },
                },
                user: {
                    connect: {
                        id: createSessionByTicketDto.userId,
                    },
                },
                source: SessionSource.WEB,
                created_at: TimeService.currentUnix(),  
                assistant: {
                    connect: {
                        id: assistantId,
                    },
                } ,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to create web session");
        }
    }

    async createSessionByDiscordChannel(discordChannelId: string, discordUsername: string, discordUserAvatar: string) {
        try {
            return this.sessionRepository.create({
                discord_channel_id: discordChannelId,
                discord_username: discordUsername,
                discord_user_avatar: discordUserAvatar,
                source: SessionSource.DISCORD,
                created_at: TimeService.currentUnix(),  
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to create discord session");
        }
    }

    async createSessionByTelegramChatId(telegramChatId: string, telegramUsername: string | null, telegramUserAvatar: string | null) {
        try {
            return this.sessionRepository.create({
                telegram_chat_id: telegramChatId,
                telegram_username: telegramUsername,
                telegram_user_avatar: telegramUserAvatar,
                source: SessionSource.TELEGRAM,
                created_at: TimeService.currentUnix(),
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to create telegram session");
        }
    }

    async getAllSessions() {
        try {
            return this.sessionRepository.findAll({});
        } catch (error) {
            throw new BusinessLogicError("Failed to get all sessions");
        }
    }

    async getSessionByDiscordChannel(discordChannelId: string) {
        try {
            return this.sessionRepository.findOne({
                discord_channel_id: discordChannelId,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to get discord session");
        }
    }

    async getSessionByTelegramChatId(telegramChatId: string) {
        try {
            return this.sessionRepository.findOne({
                telegram_chat_id: telegramChatId,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to get telegram session");
        }
    }


    async getSessionById(id: string) {
        try {
            return this.sessionRepository.findById(id);
        } catch (error) {
            throw new BusinessLogicError("Failed to get session");
        }
    }

    async getSessionsByUserId(userId: string) {

        try {
            return this.sessionRepository.findMany({
                user_id: userId,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to get session");
        }
    }

    async updateSession(id: string, data: Prisma.SessionUpdateInput) {
        try {
            return this.sessionRepository.update({
                id,
            }, data);
        } catch (error) {
            throw new BusinessLogicError("Failed to update session");
        }
    }
    
}   