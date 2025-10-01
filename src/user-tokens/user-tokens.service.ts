import { Injectable } from "@nestjs/common";
import { UserTokensRepository } from "./user-tokens.repository";

@Injectable()
export class UserTokensService {
    constructor(private readonly userTokensRepository: UserTokensRepository) {}

    async insertToken(user_id: string, token: string, expires_at: string, type: string) {
        try {
            return this.userTokensRepository.insertToken(user_id, token, expires_at, type);
        } catch (error) {
            throw error
        }
    }

    async findTokenByToken(token: string, user_id: string, type: string) {
        try {
            const data = await this.userTokensRepository.findTokenByToken(token, user_id, type);
            if(!data) {
                return null;
            }
            return data;
        } catch (error) {
            throw error
        }
    }
}
