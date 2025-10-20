import { Injectable } from "@nestjs/common";
import { LoginAttemptRepository } from "./login-attempt.repository";
import { Prisma } from "@prisma/client";

@Injectable()
export class LoginAttemptService {
    constructor(private readonly loginAttemptRepository: LoginAttemptRepository) { }

    async findLoginAttempt({
        where,
        orderBy,
    }) {
        return this.loginAttemptRepository.findSingle(where, orderBy);
    }

    async createLoginAttempt(data: any) {
        return this.loginAttemptRepository.create(data);
    }
}   