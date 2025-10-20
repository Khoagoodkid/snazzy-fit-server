import { Injectable } from "@nestjs/common";
import { ChatRepository } from "./chat.repository";
import { Prisma } from "@prisma/client";
import { BusinessLogicError } from "src/core/base.error";

@Injectable()
export class ChatService {
    constructor(private readonly chatRepository: ChatRepository) { }

    async createMessage(data: any) {
        try {
            return this.chatRepository.create(data);
        } catch (error) {
            throw new BusinessLogicError("Failed to create message");
        }
    }

    async getMessages(sessionId: string, limit?: number, offset?: number, orderBy?: any) {
        try {
            return this.chatRepository.getMessages(sessionId, limit, offset, orderBy);
        } catch (error) {
            throw new BusinessLogicError("Failed to get messages");
        }
    }


}