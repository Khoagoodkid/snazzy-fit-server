import { Injectable } from "@nestjs/common";


@Injectable()
export class UserTokensRepository {
    constructor() { }

    async insertToken(user_id: string, token: string, expires_at: string, type: string) {
        return null;
    }

    async findTokenByToken(token: string, user_id: string, type: string) {
        return null;
    }



}
