import { Module } from "@nestjs/common";
import { UserTokensRepository } from "./user-tokens.repository";
import { UserTokensService } from "./user-tokens.service";

@Module({
    providers: [UserTokensRepository, UserTokensService],
    exports: [UserTokensService],
})
export class UserTokensModule {}

